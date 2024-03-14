import { join } from "path";
import { readFile } from "fs-extra";
import { load } from "js-yaml";
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
export const TRANSLATIONS_CHARS = {
  common: "_",
  route: "~",
};

export const TRANSLATIONS_REGEX = {
  route: /~/g,
};

function buildNestedTranslations(
  outBuffer:
    | Kjam.Translations[Kjam.Locale][string][string]
    | Kjam.Translations[Kjam.Locale][string],
  keyParts: string[],
  value: string
) {
  for (let i = 0; i < keyParts.length; i++) {
    const key = keyParts[i];
    if (i === keyParts.length - 1) {
      // @ts-expect-error nevermind...
      outBuffer[key] = value;
    } else {
      // @ts-expect-error nevermind...
      outBuffer[key] = outBuffer[key] || {};
      keyParts.splice(i, 1);
      // @ts-expect-error nevermind...
      buildNestedTranslations(outBuffer[key], keyParts, value);
    }
  }
}

export async function getTranslations(
  folderPath: string,
  i18n: Kjam.I18n,
  routes: Kjam.Routes
) {
  const { locales } = i18n;
  const out: Kjam.Translations = {};
  const { common: commonChar, route: routeChar } = TRANSLATIONS_CHARS;
  const { route: routeReg } = TRANSLATIONS_REGEX;

  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];
    const target = join(folderPath, `${locale}.yml`);
    let data: Record<string, string> | undefined;
    try {
      const content = await readFile(target, "utf-8");
      data = load(content) as Record<string, string>;
    } catch (_e) {
      // no need to throw I guess
    }

    if (data) {
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
              `kjam/Serializer::getTranslations, problem found with ` +
                `'${key}' in file '${target}', only '_common' ` +
                `translations can have no dots in the key.\n`
            );
          } else {
            const scoped = keyParts[0];
            out[locale][commonChar] = out[locale][scoped] || {};
            out[locale][commonChar][keyParts[0]] = value;
          }
        } else if (keyParts.length >= 2) {
          const file = isCommon
            ? commonChar
            : keyParts[0].replace(routeReg, "");

          if (isCommon) {
            const scoped = keyParts[0];
            out[locale][file][scoped] = out[locale][file][scoped] || {};
            buildNestedTranslations(
              out[locale][file][scoped],
              keyParts.slice(1),
              value
            );
          } else {
            const file = keyParts[0].replace(routeReg, "");
            out[locale][file] = out[locale][file] || {};
            buildNestedTranslations(
              out[locale][file],
              keyParts.slice(1),
              value
            );
          }
        }
      }
    }
  }

  // automatically build translations for routes paths
  for (const route in routes) {
    const locales = routes[route as keyof typeof routes];

    for (const _locale in locales) {
      const locale = _locale as keyof typeof locales;
      const slug = locales[locale];

      out[locale][TRANSLATIONS_CHARS.route] =
        out[locale][TRANSLATIONS_CHARS.route] || {};
      out[locale][TRANSLATIONS_CHARS.route][`/${route}`] = slug;
    }
  }

  return out;
}

export function writeTranslations(
  translations: Kjam.Translations,
  write: (path: string, data: Object) => any
) {
  for (const _locale in translations) {
    const locale = _locale as keyof typeof translations;
    for (const fileName in translations[locale]) {
      const fileData = translations[locale][fileName];
      write(`i18n/${locale}/${fileName}`, fileData);
    }
  }
}
