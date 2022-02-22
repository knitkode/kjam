import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import type { Kjam } from "@kjam/core";
import { encodePathname } from "@kjam/core"; // ../../core/src
import { Serializer, Img } from "@kjam/serializer"; // ../../serializer/src

export type SerializerNextOutputConfig = {
  /**
   * Same as `import("next").NextConfig["i18n"]` but some of these are required.
   *
   * The `i18n` next configuratoin cannot be retrieved asynchronously
   * so it must be passed set here and it needs to match the remote content
   * one.
   *
   * TODO: implement a check if a mismatch happens and report to the user
   */
  i18n: Kjam.I18n;
  redirects: Redirect[];
  rewrites: Rewrite[];
};

export class SerializerNext extends Serializer {
  override async transformBodyImage(markdownImg: string) {
    const img = new Img(markdownImg);
    return await img.toComponent(`layout="fill"`);
  }

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

    for (const [id, locales] of Object.entries(routes)) {
      for (const [locale, _url] of Object.entries(locales)) {
        let url = _url;
        const templateAsUrl = `/${id}`;

        // only redirect if the template name of `/pages/${name}` is not the same
        // as the actual slug of this route
        if (url !== templateAsUrl && id !== "home") {
          // prepend locale if we need to redirect e.g. `/en/galleries` to `/en/gallery`
          // basically when the page template name does not match neither the
          // default language slug nor the translated slugs
          if (locale !== i18n.defaultLocale) {
            url = `${locale}/${url}`;
          }

          const redirect = this.getPathRedirect(locale, templateAsUrl, url);
          redirects.push(redirect);

          if (this.collections[id]) {
            const redirectDynamic = this.getPathRedirect(
              locale,
              templateAsUrl,
              url,
              true
            );
            redirects.push(redirectDynamic);
          }
        }
      }
    }

    if (this.debug) {
      console.log("kjam/serialier-next::redirects", redirects);
    }

    return redirects;
  }

  /**
   * Get `rewrites` config for `next.config.js`
   */
  getRewrites() {
    const { routes } = this;
    const rewrites = [];

    for (const [id, locales] of Object.entries(routes)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_locale, url] of Object.entries(locales)) {
        const templateAsUrl = `/${id}`;

        if (url !== templateAsUrl && id !== "home") {
          const rewrite = this.getPathRewrite(url, templateAsUrl);
          rewrites.push(rewrite);

          if (this.collections[id]) {
            const rewriteDynamic = this.getPathRewrite(
              url,
              templateAsUrl,
              true
            );
            rewrites.push(rewriteDynamic);
          }
        }
      }
    }

    if (this.debug) {
      console.log("kjam/serialier-next::rewrites", rewrites);
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

  getPathRedirect(
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
