'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@kjam/core');
var serializer = require('@kjam/serializer');

// import { getRedirects, getRewrites } from "@koine/next/config-i18n";
class SerializerNext extends serializer.Serializer {
    async transformBodyImage(markdownImg) {
        const img = new serializer.Img(markdownImg);
        return await img.toComponent(`layout="fill"`);
    }
    async start() {
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
                const idNormalised = (id.startsWith("pages/") ? id.replace("pages/", "") : id);
                const templateAsUrl = `/${idNormalised}`;
                // only redirect if the template name of `/pages/${name}` is not the same
                // as the actual slug of this route
                if (url !== templateAsUrl && idNormalised !== "home") {
                    // prepend locale if we need to redirect e.g. `/en/galleries` to `/en/gallery`
                    // basically when the page template name does not match neither the
                    // default language slug nor the translated slugs
                    if (locale !== i18n.defaultLocale) {
                        url = `${locale}/${url}`;
                    }
                    const redirect = this.getPathRedirect(locale, templateAsUrl, url);
                    redirects.push(redirect);
                    if (this.collections[idNormalised]) {
                        const redirectDynamic = this.getPathRedirect(locale, templateAsUrl, url, true);
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
                const idNormalised = (id.startsWith("pages/") ? id.replace("pages/", "") : id);
                const templateAsUrl = `/${idNormalised}`;
                if (url !== templateAsUrl && idNormalised !== "home") {
                    const rewrite = this.getPathRewrite(url, templateAsUrl);
                    rewrites.push(rewrite);
                    if (this.collections[idNormalised]) {
                        const rewriteDynamic = this.getPathRewrite(url, templateAsUrl, true);
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
    getPathRewrite(source, destination, dynamic) {
        const suffix = dynamic ? `/:path*` : "";
        return {
            source: `/${core.encodePathname(source)}${suffix}`,
            destination: `/${core.encodePathname(destination)}${suffix}`,
        };
    }
    getPathRedirect(locale, localisedPathname, templateName, dynamic) {
        const suffix = dynamic ? `/:slug*` : "";
        return {
            source: `/${locale}/${core.encodePathname(localisedPathname)}${suffix}`,
            destination: `/${core.encodePathname(templateName)}${suffix}`,
            permanent: false, // TODO: based on environment variable
            locale: false,
        };
    }
}

exports.SerializerNext = SerializerNext;
