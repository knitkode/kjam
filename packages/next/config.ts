import "dotenv/config";
// import { resolve, relative, join } from "path";
// import { sync } from "pkg-dir";
import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import type { I18nConfig } from "next-translate";
import { EntriesMapById, Kjam, ApiGithub, normalisePathname } from "@kjam/core";
// import type { SerializerNextOutputConfig } from "@kjam/serializer-next";

// FIXME: using the above import of this type breaks the nx  action build,
// so we duplicate the type...
type SerializerNextOutputConfig = {
  i18n: Kjam.I18n;
  redirects: Redirect[];
  rewrites: Rewrite[];
};

export type ConfigNextOptions = {
  permanentRedirects?: boolean;
};

/**
 * The `i18n` next configuration cannot be retrieved asynchronously
 * so it needs to match the remote content one.
 * For this we rely on `next-translate` to grab the i18n info from the `i18n.js`
 * file in the root, assuming that is always used, even for a single language
 * application. `next-translate` is used as a dependency too in this package,
 * so no need to install it in the app consuming `kjam`.
 */
export function ConfigNext(
  configNext: NextConfig,
  options?: ConfigNextOptions
) {
  const api: ApiGithub = new ApiGithub();
  const i18n = getI18n();

  /**
   * Same as `import("next").NextConfig["i18n"]` but some of these are required.
   *
   * The `i18n` next configuration cannot be retrieved asynchronously
   * so it must be passed set here and it needs to match the remote content
   * one (the `.kjam/i18n.json` file's content).
   */
  function getI18n(): Omit<NextConfig["i18n"], keyof Kjam.I18n> & Kjam.I18n {
    // const i18nJsDir = resolve(
    //   relative(pkgDir(), process.env["NEXT_TRANSLATE_PATH"] || ".")
    // );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const i18nJs = import(join(i18nJsDir, "i18n")) as I18nConfig;
    const { locales, defaultLocale } = configNext.i18n || {};

    return {
      localeDetection: false,
      locales: locales || ["en"],
      defaultLocale: defaultLocale || "en",
      ...(configNext.i18n || {}),
    };
  }

  /**
   * Default configuration for `next-translate`
   *
   * - Locale files are loaded from the github raw API
   * - Support for `.page.tsx` pages extension
   * - Do not log build at each request...
   */
  function getTranslate(): I18nConfig {
    const { locales, defaultLocale } = i18n;

    return {
      locales,
      defaultLocale,
      // @see https://nextjs.org/docs/advanced-features/i18n-routing
      // @ts-expect-error ISSUE: https://github.com/vinissimus/next-translate/issues/703#issuecomment-1048746067
      extensionsRgx: /\.page\.(tsx|ts|js|mjs|jsx)$/,
      logBuild: false,
      // @see https://github.com/vinissimus/next-translate/issues/710#issuecomment-948489007
      loadLocaleFrom: (locale?: string, namespace?: string) =>
        api.getData(`i18n/${locale || "en"}/${namespace || "_"}`, {}),
      // loadLocaleFrom: (locale, namespace) =>
      //   import(`./public/locales/${locale}/${namespace}.json`).then(
      //     (m) => m.default
      //   ),
    };
  }

  /**
   * Get images domain
   *
   * During local development we allow also `localhost` as the @kjam/cli will
   * serve images from there
   */
  function getImagesDomains() {
    if (process.env["NODE_ENV"] !== "production") {
      return [api.domain, "localhost"];
    }
    return [api.domain];
  }

  /**
   * We rely on `next-translate` to grab the i18n info, assuming that we always
   * use it, even for a single language application.
   *
   * @see https://github.com/vinissimus/next-translate/blob/master/src/plugin/index.ts#L93
   */
  // function pkgDir() {
  //   try {
  //     // eslint-disable-next-line @typescript-eslint/no-var-requires
  //     return sync() || process.cwd();
  //   } catch (e) {
  //     return process.cwd();
  //   }
  // }

  async function getRedirects() {
    const data = await api.getData<SerializerNextOutputConfig>("next.config");
    let redirects = data?.redirects ?? [];

    if (options?.permanentRedirects) {
      redirects = redirects.map((redirect) => {
        return {
          ...redirect,
          permanent: true,
        };
      });
    }

    return redirects;
  }

  async function getRewrites() {
    const data = await api.getData<SerializerNextOutputConfig>("next.config");
    return data?.rewrites ?? [];
  }

  async function getPathMap() {
    const byRoute = await api.getData<EntriesMapById>("byRoute");
    if (!byRoute) {
      return {};
    }

    const pathMap = {} as Record<
      string,
      {
        page: string;
        query: {
          slug: string[];
        };
      }
    >;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_route, locales] of Object.entries(byRoute)) {
      for (const [locale, entry] of Object.entries(locales)) {
        const slugLocale = locale === i18n.defaultLocale ? "" : `${locale}/`;
        const fullSlug = `/${normalisePathname(`${slugLocale}${entry.url}`)}`;
        pathMap[fullSlug] = {
          page: `/${entry.templateSlug.split("/")[0]}`,
          query: {
            slug: entry.slug.split("/"),
          },
        };
      }
    }

    // console.log("kjam/config::getPathMap", pathMap);

    return pathMap;
  }

  return {
    api,
    i18n,
    getTranslate,
    getImagesDomains,
    getRedirects,
    getRewrites,
    getPathMap,
  };
}

export const config = (next: NextConfig = {}, options?: ConfigNextOptions) => {
  const configKjam = ConfigNext(next, options);
  const configTranslate = configKjam.getTranslate();

  const configNext: NextConfig = {
    // first we set some overridable opinionated defaults
    // @see https://bit.ly/3c7BsAx
    pageExtensions: ["page.tsx", "page.ts"],
    i18n: configKjam.i18n,
    reactStrictMode: true,
    // @see https://nextjs.org/docs/api-reference/next.config.js
    eslint: {
      ignoreDuringBuilds: true, // we have this strict check on each commit
    },
    typescript: {
      ignoreBuildErrors: true, // we have this strict check on each commit
    },
    swcMinify: true,
    compiler: {
      styledComponents: true,
    },
    experimental: {
      scrollRestoration: true,
      urlImports: [configKjam.api.getUrl()],
      // concurrentFeatures: true,
      // serverComponents: true,
      // reactRoot: true,
    },
    nx: {
      // @see https://github.com/gregberge/svgr
      svgr: true,
    },
    // from here below we manually merge the defaults with the next.js app config
    ...next,
    images: {
      domains: [
        ...configKjam.getImagesDomains(),
        ...(next.images?.domains || []),
      ],
    },
    env: {
      // KJAM_GIT: Object.keys(config.api.getConfig()).join("/"),
      KJAM_GIT: process.env["KJAM_GIT"] || "",
      ...(next.env || {}),
    },
    // FIXME: this temporarily fixes a build problem related to @kjam/core
    // happening in the next.js app build process
    webpack: (_config, options) => {
      const config =
        typeof next.webpack === "function"
          ? next.webpack(_config, options)
          : _config;
      if (!options.isServer) {
        config.resolve.fallback.fs = false;
      }

      // TODO: idea, use webpack DEFINE plugin to expose kjam within the scope
      // of getStaticProps/getStaticPaths/getServerSideProps
      return config;
    },
    async redirects() {
      const defaults = await configKjam.getRedirects();
      if (next.redirects) {
        const customs = await next.redirects();
        return [...defaults, ...customs];
      }
      return [...defaults];
    },
    async rewrites() {
      const defaults = await configKjam.getRewrites();

      if (next.rewrites) {
        const customs = await next.rewrites();

        if (Array.isArray(customs)) {
          return {
            beforeFiles: defaults,
            afterFiles: customs,
            fallback: [],
          };
        }

        return {
          ...customs,
          beforeFiles: [...defaults, ...(customs.beforeFiles || [])],
        };
      }
      return {
        afterFiles: [],
        beforeFiles: defaults,
        fallback: [],
      };
    },
  };

  return {
    configNext,
    configTranslate,
  };
};

export const withKjam = (): // configNext: NextConfig = {},
// options?: ConfigNextOptions
NextConfig => {
  const { configNext } = config();

  return configNext;
};

export default withKjam;
