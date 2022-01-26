import { join } from "path";
import { existsSync, readFileSync } from "fs-extra";
import type { Structure, SiteTranslations } from "../../../core/src";
import { load } from "js-yaml";

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
export const TRANSLATIONS_CHARS = {
  common: "_",
  route: "~",
};

export const TRANSLATIONS_REGEX = {
  common: /^_/,
  route: /~/g,
};

export function getTranslations(folderPath: string, structure: Structure) {
  const { locales } = structure.i18n;
  const out: SiteTranslations = {};
  const { common: commonChar, route: routeChar } = TRANSLATIONS_CHARS;
  const { common: commonReg, route: routeReg } = TRANSLATIONS_REGEX;

  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];
    const target = join(folderPath, `${locale}.yml`);

    if (existsSync(target)) {
      const content = readFileSync(target, "utf-8");
      const data = load(content) as Record<string, string>;
      out[locale] = out[locale] || {};

      for (const key in data) {
        const value = data[key];
        const keyParts = key.split(".");
        // const isCommon = key[0] === commonChar;
        const isRoute = key[0] === routeChar;
        const isComponent = key[0] === key[0].toUpperCase();
        const isCommon = !isRoute && !isComponent;

        if (keyParts.length === 1) {
          if (!isCommon) {
            console.error(
              `Only '_common' translations can have no dots in the key.`
            );
          } else {
            const scoped = keyParts[0];
            out[locale][commonChar] = out[locale][scoped] || {};
            out[locale][commonChar][keyParts[0]] = value;
          }
        } else if (keyParts.length === 2) {
          const file = isCommon
            ? commonChar
            : keyParts[0].replace(routeReg, "");

          if (isCommon) {
            const scoped = keyParts[0];
            out[locale][file][scoped] = out[locale][file][scoped] || {};
            // @ts-ignore
            out[locale][file][scoped][keyParts[1]] = value;
          } else {
            const file = keyParts[0].replace(routeReg, "");
            out[locale][file] = out[locale][file] || {};
            out[locale][file][keyParts[1]] = value;
          }
        } else {
          // throw Error(
          console.warn(
            `kjam/Serializer::getTranslations, too many levels of 
depth of '${key}' in file '${target}', max 2 allowed (one dot!).
\n`
          );
        }
      }
    }
  }

  // automatically build translations for routes paths
  for (const routeKey in structure.routes) {
    const routeLocalisedPaths = structure.routes[routeKey];

    for (const locale in routeLocalisedPaths) {
      const localisedPath = routeLocalisedPaths[locale];

      out[locale][TRANSLATIONS_CHARS.route] =
        out[locale][TRANSLATIONS_CHARS.route] || {};
      out[locale][TRANSLATIONS_CHARS.route][`/${routeKey}`] = localisedPath;
    }
  }

  return out;
}

export function writeTranslations(
  translations: SiteTranslations,
  write: (path: string, data: Object) => any
) {
  for (const locale in translations) {
    for (const fileName in translations[locale]) {
      const fileData = translations[locale][fileName];
      write(`i18n/${locale}/${fileName}`, fileData);
    }
  }
}
