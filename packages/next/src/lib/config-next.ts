import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import type { BaseConfig, EntriesMapByRoute, StructureI18n } from "@kjam/core";
import { ApiGit, normalisePathname } from "@kjam/core";
// import type { SerializerNextOutputConfig } from "../../../serializer-next/src";
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
type ConfigNextI18n = StructureI18n &
  Omit<NextConfig["i18n"], keyof StructureI18n>;

export type ConfigNextOptions = BaseConfig & {
  i18n: ConfigNextI18n;
};

function ConfigNext(config?: ConfigNextOptions) {
  const api: ApiGit = ApiGit;
  const i18n: ConfigNextI18n = config?.i18n || {
    locales: ["en"],
    defaultLocale: "en",
  };

  /**
   * Get "base" config for `next.config.js`
   */
  function base() {
    return {
      // @see https://bit.ly/3c7BsAx
      pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
      reactStrictMode: true,
      i18n,
      // swcMinify: true,
      // experimental: {
      //   scrollRestoration: true,
      //   concurrentFeatures: true,
      //   serverComponents: true,
      //   reactRoot: true,
      // },
    };
  }

  async function getI18n() {}

  async function getRedirects() {
    const data = await api.getData<SerializerNextOutputConfig>("next.config");
    return data.redirects;
  }

  async function getRewrites() {
    const data = await api.getData<SerializerNextOutputConfig>("next.config");
    return data.rewrites;
  }

  async function getPathMap() {
    const byRoute = await api.getData<EntriesMapByRoute>("byRoute");
    const pathMap = {} as Record<
      string,
      {
        page: string;
        query: {
          slug: string[];
        };
      }
    >;

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
      console.log("kjam/config::getPathMap  ", pathMap);
    }
  }

  return {
    base,
    getRedirects,
    getRewrites,
    getPathMap,
  };
}

export const config = ConfigNext;
