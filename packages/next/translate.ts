import { kjam } from "./content";

/**
 * Default configuration for `next-translate`
 *
 * - Locale files are loaded from the github raw API
 * - Support for `.page.tsx` pages extension
 * - Do not log build at each request...
 */
export function translate() {
  return {
    // @see https://nextjs.org/docs/advanced-features/i18n-routing
    extensionsRgx: /\.page\.(tsx|ts|js|mjs|jsx)$/,
    logBuild: false,
    // @see https://github.com/vinissimus/next-translate/issues/710#issuecomment-948489007
    loadLocaleFrom: (locale: string, namespace: string) =>
      kjam.api.getData(`i18n/${locale}/${namespace}`, {}),
    // loadLocaleFrom: (locale, namespace) =>
    //   import(`./public/locales/${locale}/${namespace}.json`).then(
    //     (m) => m.default
    //   ),
  };
}
