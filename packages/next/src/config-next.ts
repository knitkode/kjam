import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import type { BaseConfig, EntriesMapByRoute, StructureI18n } from "@kjam/core";
import { ApiGit, normalisePathname } from "@kjam/core";
// import type { SerializerNextOutputConfig } from "@kjam/serializer-next";

// FIXME: using the above import of this type breaks the nx build,
// so we duplicate the type...
type SerializerNextOutputConfig = {
  i18n: StructureI18n;
  redirects: Redirect[];
  rewrites: Rewrite[];
};

/**
 * Same as `import("next").NextConfig["i18n"]` but some of these are required.
 *
 * The `i18n` next configuratoin cannot be retrieved asynchronously
 * so it must be passed set here and it needs to match the remote content
 * one.
 *
 * FIXME: implement a check if a mismatch happens and report to the user
 */
type ConfigNextI18n = StructureI18n & NextConfig["i18n"]; // Omit<NextConfig["i18n"], keyof StructureI18n>;

export type ConfigNextOptions = BaseConfig & {
  i18n: ConfigNextI18n;
};

function ConfigNext(config?: ConfigNextOptions) {
  const api: ApiGit = new ApiGit();

  const i18n: ConfigNextI18n = {
    locales: ["en"],
    defaultLocale: "en",
    localeDetection: false,
    ...(config?.i18n || {}),
  };

  /**
   * Get "base" config for `next.config.js`
   *
   * @param {boolean} [sc=true] Whether to use Styled Components
   * @param {boolean} [svgr=true] Whether to use NX svg support
   */
  function base(sc = true, svgr = true) {
    return {
      // @see https://bit.ly/3c7BsAx
      pageExtensions: ["page.tsx", "page.ts"],
      i18n,
      reactStrictMode: true,
      images: {
        domains: [api.domain],
      },
      // @see https://nextjs.org/docs/api-reference/next.config.js
      eslint: {
        ignoreDuringBuilds: true, // we have this strict check on each commit anyway
      },
      typescript: {
        ignoreBuildErrors: true, // we have this strict check on each commit anyway
      },
      swcMinify: true,
      experimental: {
        styledComponents: sc,
        scrollRestoration: true,
        // concurrentFeatures: true,
        // serverComponents: true,
        // reactRoot: true,
        urlImports: [api.getUrl()],
      },
      nx: {
        // Set this to true if you would like to to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr,
      },
    };
  }

  // async function getI18n() {}

  async function getRedirects() {
    const data = await api.getData<SerializerNextOutputConfig>("next.config");
    return data?.redirects ?? [];
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

    if (config?.debug) {
      console.log("kjam/config::getPathMap", pathMap);
    }

    return pathMap;
  }

  return {
    base,
    getRedirects,
    getRewrites,
    getPathMap,
  };
}

export const config = ConfigNext;