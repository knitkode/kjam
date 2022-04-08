import "dotenv/config";
import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import type { I18nConfig } from "next-translate";
import type { EntriesMapById, Kjam } from "@kjam/core";
import { ApiGithub, normalisePathname } from "@kjam/core";
// import type { SerializerNextOutputConfig } from "@kjam/serializer-next";

// FIXME: using the above import of this type breaks the nx action build,
// so we duplicate the type...
type SerializerNextOutputConfig = {
  i18n: Kjam.I18n;
  redirects: Redirect[];
  rewrites: Rewrite[];
};

export type KjamConfig = {
  permanentRedirects?: boolean;
};

/**
 * With kjam next configuration
 *
 * The `i18n` next configuration cannot be retrieved asynchronously
 * so it needs to match the remote content one.
 * We rely on `next-translate` assuming that is always used, even for a single
 * language application. `next-translate` is used as a dependency too in this
 * package, so no need to install it in the app consuming `kjam`.
 */
export const withKjam = (config: NextConfig & KjamConfig = {}) => {
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
    const { locales, defaultLocale } = config.i18n || {};

    return {
      localeDetection: false,
      locales: locales || ["en"],
      defaultLocale: defaultLocale || "en",
      ...(config.i18n || {}),
    };
  }

  /**
   * Default configuration for `next-translate`
   *
   * - Locale files are loaded from the github raw API
   * - Support for `.page.tsx` pages extension
   * - Do not log build at each request...
   */
  function translateConfig(
    i18nConfig: Omit<
      I18nConfig,
      | "locales"
      | "defaultLocale"
      | "extensionsRgx"
      | "logBuild"
      | "loadLocaleFrom"
    > = {}
  ): I18nConfig {
    const { locales, defaultLocale } = i18n;

    return {
      ...i18nConfig,
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
   * Get redirects
   */
  async function getRedirects() {
    const data = await api.getData<SerializerNextOutputConfig>("next.config");
    let redirects = data?.redirects ?? [];

    if (config?.permanentRedirects) {
      redirects = redirects.map((redirect) => {
        return {
          ...redirect,
          permanent: true,
        };
      });
    }

    return redirects;
  }

  /**
   * Get rewrites
   */
  async function getRewrites() {
    const data = await api.getData<SerializerNextOutputConfig>("next.config");
    return data?.rewrites ?? [];
  }

  /**
   * Get path map
   *
   * @deprecated
   */
  async function _getPathMap() {
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

    return pathMap;
  }

  const nextConfig: NextConfig = {
    // we manually merge the defaults with the next.js app config
    ...config,
    i18n,
    images: {
      domains: [...getImagesDomains(), ...(config.images?.domains || [])],
    },
    env: {
      // KJAM_GIT: Object.keys(config.api.getConfig()).join("/"),
      KJAM_GIT: process.env["KJAM_GIT"] || "",
      KJAM_FOLDER: process.env["KJAM_FOLDER"] || "",
      ...(config.env || {}),
    },
    // FIXME: this temporarily fixes a build problem related to @kjam/core
    // happening in the next.js app build process
    webpack: (_config, options) => {
      const webpackConfig =
        typeof config.webpack === "function"
          ? config.webpack(_config, options)
          : _config;
      if (!options.isServer) {
        webpackConfig.resolve.fallback.fs = false;
      }

      // TODO: idea, use webpack DEFINE plugin to expose kjam within the scope
      // of getStaticProps/getStaticPaths/getServerSideProps
      return webpackConfig;
    },
    async redirects() {
      const defaults = await getRedirects();
      if (config.redirects) {
        const customs = await config.redirects();
        return [...defaults, ...customs];
      }
      return defaults;
    },
    async rewrites() {
      const defaults = await getRewrites();

      if (config.rewrites) {
        const customs = await config.rewrites();

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
    nextConfig,
    translateConfig,
  };
};

export default withKjam;
