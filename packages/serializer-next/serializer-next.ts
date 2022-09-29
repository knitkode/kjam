import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import type { Kjam } from "@kjam/core";
import {
  encodePathname,
  // } from "@kjam/core";
} from "../core";
import {
  Serializer,
  Img,
  // } from "@kjam/serializer";
} from "../serializer";

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
    this.writeFile("next/config", {
      i18n: {
        locales: this.i18n.locales,
        defaultLocale: this.i18n.defaultLocale,
      },
      redirects: this.getRedirects(),
      rewrites: this.getRewrites(),
    });

    // const map = await this.getEntriesMap();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [id, locales] of Object.entries(this.entries)) {
      // FIXME: using the following would help creating staticlly Untranslated Pages...
      // for (const [locale, entry] of Object.entries(this.i18n.locales)) {
      for (const [locale, entry] of Object.entries(locales)) {
        // FIXME: still not sure what is the best here, maybe the template slug
        // is only needed for next.js routing system, maybe not, right now we
        // are creating multiple endpoints for the same entry, which is probably
        // not ideal
        const { templateSlug } = entry;
        this.writeFile(`next/pages/${templateSlug}__${locale}`, entry);
      }
    }

    return;
  }

  /**
   * Get `redirects` config for `next.config.js`
   */
  getRedirects() {
    const { routes, i18n } = this;
    const redirects = [];

    for (const [id, locales] of Object.entries(routes)) {
      for (const [locale, url] of Object.entries(locales)) {
        let localisedUrl = url;
        const templateAsUrl = `/${id}`;

        // only redirect if the template name of `/pages/${name}` is not the same
        // as the actual slug of this route
        if (url !== templateAsUrl) {
          // prepend locale if we need to redirect e.g. `/en/galleries` to `/en/gallery`
          // basically when the page template name does not match neither the
          // default language slug nor the translated slugs
          if (
            locale !== i18n.defaultLocale ||
            (locale === i18n.defaultLocale && !i18n.hideDefaultLocaleInUrl)
          ) {
            localisedUrl = `${locale}/${url}`;
          }

          if (localisedUrl !== templateAsUrl) {
            // redirect /it/eventi to /pages/
            redirects.push(
              this.getPathRedirect(locale + templateAsUrl, localisedUrl)
            );

            // redirect /eventi to /it/eventi
            if (url !== localisedUrl) {
              redirects.push(this.getPathRedirect(url, localisedUrl));
            }

            if (this.collections[id]) {
              // redirect /it/events/:slug* to /eventi/:slug*
              redirects.push(this.getPathRedirect(
                locale + templateAsUrl,
                localisedUrl,
                true
              ));

              if (locale === i18n.defaultLocale && i18n.hideDefaultLocaleInUrl) {
                // redirect /it/eventi/:slug* to /eventi/:slug*
                redirects.push(this.getPathRedirect(
                  locale + localisedUrl,
                  localisedUrl,
                  true
                ));
              }
            }
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

        if (url !== templateAsUrl) {
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

  getPathRedirect(source: string, destination: string, dynamic?: boolean) {
    const suffix = dynamic ? `/:slug*` : "";
    return {
      source: `/${encodePathname(source)}${suffix}`,
      destination: `/${encodePathname(destination)}${suffix}`,
      permanent: false, // TODO: based on environment variable
      locale: false,
    };
  }
}
