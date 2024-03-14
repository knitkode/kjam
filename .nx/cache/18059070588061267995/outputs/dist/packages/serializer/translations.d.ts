import type { Kjam } from "@kjam/core";
/**
 * Convention for translation strings
 *
 * Based on the shape of the translation keys:
 * - `_commonKey`: inital underscore marks common site wide translations to be included in every page
 * - `~route`: lowercase with initial tilde mark route specific translations
 *   - `~route~path`: tilde works as a slash to concatenate pathnames
 *   - `~route~`: ending tilde marks translations for a dynamic path portion
 * - `ComponentKey`: Pascal case marks Component specific translations
 *
 * This convention uses only unreserved characters that [do not need to be encoded
 * in a URL](https://perishablepress.com/stop-using-unsafe-characters-in-urls/).
 * This allows to transform the keys into URL ready filenames to be uploaded
 * on a CDN or github without needing to care about URL encoding.
 */
export declare const TRANSLATIONS_CHARS: {
    common: string;
    route: string;
};
export declare const TRANSLATIONS_REGEX: {
    route: RegExp;
};
export declare function getTranslations(folderPath: string, i18n: Kjam.I18n, routes: Kjam.Routes): Promise<Kjam.Translations>;
export declare function writeTranslations(translations: Kjam.Translations, write: (path: string, data: Object) => any): void;
