import "dotenv/config";
import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import type { I18nConfig } from "next-translate";
import type { EntriesMapByRoute, Kjam } from "@kjam/core";
import { ApiGithub, normalisePathname } from "@kjam/core";
// import type { SerializerNextOutputConfig } from "@kjam/serializer-next";

// FIXME: using the above import of this type breaks the nx build,
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
  nextConfig: NextConfig,
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require("path");
    const i18nJsDir = path.resolve(
      path.relative(pkgDir(), process.env["NEXT_TRANSLATE_PATH"] || ".")
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const i18nJs = require(path.join(i18nJsDir, "i18n")) as I18nConfig;

    return {
      localeDetection: false,
      ...(nextConfig.i18n || {}),
      locales: i18nJs.locales || ["en"],
      defaultLocale: i18nJs.defaultLocale || "en",
    };
  }

  /**
   * We rely on `next-translate` to grab the i18n info, assuming that we always
   * use it, even for a single language application.
   *
   * @see https://github.com/vinissimus/next-translate/blob/master/src/plugin/index.ts#L93
   */
  function pkgDir() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require("pkg-dir").sync() || process.cwd();
    } catch (e) {
      return process.cwd();
    }
  }

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
    const byRoute = await api.getData<EntriesMapByRoute>("byRoute");
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
    for (const [_routeId, routeLocales] of Object.entries(byRoute)) {
      for (const [routeLocale, route] of Object.entries(routeLocales)) {
        const slugLocale =
          routeLocale === i18n.defaultLocale ? "" : `${routeLocale}/`;
        const fullSlug = `/${normalisePathname(`${slugLocale}${route.slug}`)}`;
        pathMap[fullSlug] = {
          page: `/${route.templateSlug.split("/")[0]}`,
          query: {
            slug: route.slug.split("/"),
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
    getRedirects,
    getRewrites,
    getPathMap,
  };
}

export const withKjam = (
  nextConfig: NextConfig = {},
  options?: ConfigNextOptions
): NextConfig => {
  const config = ConfigNext(nextConfig, options);

  return {
    ...nextConfig,
    // @see https://bit.ly/3c7BsAx
    pageExtensions: ["page.tsx", "page.ts"],
    i18n: config.i18n,
    reactStrictMode: true,
    images: {
      domains: [config.api.domain],
    },
    env: {
      // KJAM_GIT: Object.keys(config.api.getConfig()).join("/"),
      KJAM_GIT: process.env["KJAM_GIT"] || "",
    },
    // FIXME: this temporarily fixes a build problem related to @kjam/core
    // happening in the next.js app build process
    webpack: (_config, options) => {
      const config =
        typeof nextConfig.webpack === "function"
          ? nextConfig.webpack(_config, options)
          : _config;
      if (!options.isServer) {
        config.resolve.fallback.fs = false;
      }

      // TODO: idea, use webpack DEFINE plugin to expose kjam within the scope
      // of getStaticProps/getStaticPaths/getServerSideProps
      return config;
    },
    // @see https://nextjs.org/docs/api-reference/next.config.js
    eslint: {
      // we have this strict check on each commit anyway
      ignoreDuringBuilds: true,
    },
    typescript: {
      // we have this strict check on each commit anyway
      ignoreBuildErrors: true,
    },
    swcMinify: true,
    experimental: {
      styledComponents: true,
      scrollRestoration: true,
      // concurrentFeatures: true,
      // serverComponents: true,
      // reactRoot: true,
      urlImports: [config.api.getUrl()],
    },
    nx: {
      // Set this to true if you would like to to use SVGR
      // See: https://github.com/gregberge/svgr
      svgr: true,
    },
    async redirects() {
      const defaults = await config.getRedirects();
      if (nextConfig.redirects) {
        const customs = await nextConfig.redirects();
        return [...defaults, ...customs];
      }
      return [...defaults];
    },
    async rewrites() {
      const defaults = await config.getRewrites();

      if (nextConfig.rewrites) {
        const customs = await nextConfig.rewrites();

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
};

export default withKjam;
