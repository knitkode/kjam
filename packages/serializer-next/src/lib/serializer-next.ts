import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import type { StructureI18n } from "../../../core/src"; // @kjam/
import { Serializer } from "../../../serializer/src"; // @kjam/
import { encodePathname } from "../../../core/src"; // @kjam/

export type SerializerNextOutputConfig = {
  /**
   * Same as `import("next").NextConfig["i18n"]` but some of these are required.
   *
   * The `i18n` next configuratoin cannot be retrieved asynchronously
   * so it must be passed set here and it needs to match the remote content
   * one.
   *
   * FIXME: implement a check if a mismatch happens and report to the user
   */
  i18n: StructureI18n;
  redirects: Redirect[];
  rewrites: Rewrite[];
};

export class SerializerNext extends Serializer<{}> {
  override async start() {
    this.writeFile("next.config", {
      i18n: {
        locales: this.i18n.locales,
        defaultLocale: this.i18n.defaultLocale,
      },
      redirects: this.getRedirects(),
      rewrites: this.getRewrites(),
    });

    return;
  }

  /**
   * Get `redirects` config for `next.config.js`
   */
  getRedirects() {
    const { routes, i18n } = this;
    const redirects = [];

    for (const [templateName, routeLocales] of Object.entries(routes)) {
      for (let [routeLocale, routeLocalisedPathname] of Object.entries(
        routeLocales
      )) {
        const templateAsPathname = `/${templateName}`;

        // only redirect if the template name of `/pages/${name}` is not the same
        // as the actual slug of this route
        if (routeLocalisedPathname !== templateAsPathname) {
          // prepend locale if we need to redirect e.g. `/en/galleries` to `/en/gallery`
          // basically when the page template name does not match neither the
          // default language slug nor the translated slugs
          if (routeLocale !== i18n.defaultLocale) {
            routeLocalisedPathname = `${routeLocale}/${routeLocalisedPathname}`;
          }

          const redirect = this.getDynamicPathRedirect(
            routeLocale,
            templateAsPathname,
            routeLocalisedPathname
          );
          const redirectDynamic = this.getDynamicPathRedirect(
            routeLocale,
            templateAsPathname,
            routeLocalisedPathname,
            true
          );
          redirects.push(redirect);
          redirects.push(redirectDynamic);
        }
      }
    }

    if (this.debug) {
      console.log("KjamNext::redirects", redirects);
    }

    return redirects;
  }

  /**
   * Get `rewrites` config for `next.config.js`
   */
  getRewrites() {
    const { routes } = this;
    const rewrites = [];

    for (const [templateName, routeLocales] of Object.entries(routes)) {
      for (const [_routeLocale, routeLocalisedPathname] of Object.entries(
        routeLocales
      )) {
        const templateAsPathname = `/${templateName}`;

        if (routeLocalisedPathname !== templateAsPathname) {
          const rewrite = this.getPathRewrite(
            routeLocalisedPathname,
            templateAsPathname
          );
          const rewriteDynamic = this.getPathRewrite(
            routeLocalisedPathname,
            templateAsPathname,
            true
          );
          rewrites.push(rewrite);
          rewrites.push(rewriteDynamic);
        }
      }
    }

    if (this.debug) {
      console.log("KjamNext::rewrites", rewrites);
    }

    return rewrites;
  }

  getPathRewrite(source: string, destination: string, dynamic?: boolean) {
    const suffix = dynamic ? `/:path*` : "";
    return {
      source: `/${encodePathname(source)}${suffix}`,
      destination: `/${encodePathname(destination)}${suffix}`,
    };
  }

  getDynamicPathRedirect(
    locale: string,
    localisedPathname: string,
    templateName: string,
    dynamic?: boolean
  ) {
    const suffix = dynamic ? `/:slug*` : "";
    return {
      source: `/${locale}/${encodePathname(localisedPathname)}${suffix}`,
      destination: `/${encodePathname(templateName)}${suffix}`,
      permanent: false, // TODO: based on environment variable
      locale: false,
    };
  }
}
