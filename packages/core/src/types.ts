type Locale = string;

type RouteId = string;

type Slug = string;

type Template = string;

export type Structure = {
  i18n: StructureI18n;
  routes: StructureRoutes;
};

export type StructureI18n = {
  locales: Locale[];
  defaultLocale: Locale;
};

export type StructureRoutes = Record<Template, Record<Locale, Slug>>;

/**
 * Structure:
 *
 * ```txt
 * |__`/locale` (folder)
 *    |__`filename.json` (in here max two levels deep)
 *        |__"rootLevel": "rootValue",
 *           |__"scopedLevel": "scopedValue"
 * ```
 *
 * The JSON like object would be:
 * ```
 * {
 *   "en": {
 *     "common": {
 *       "stringKey": "Site wide translated value",
 *       "maxDepth": {
 *         "stringKey": "Site wide 'scoped' translated value",
 *       }
 *     },
 *     "routes": {
 *       "stringKey": "/translated/path/name"
 *     }
 *     "Component": {
 *       "stringKey": "Component specific translated value",
 *       "maxDepth": {
 *         "stringKey": "Component specific 'scoped' translated value",
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type SiteTranslations = Record<
  Locale,
  Record<"*" | "~" | string, Record<string, string | Record<string, string>>>
>;

/**
 * Given this input string `/news/some-title/index.it.md`
 */
export type EntryMeta = {
  /** e.g. `/news/some-title` */
  dir: string;
  /** e.g. `/news` */
  parentDirs: string;
  /** e.g. `index.it.md` */
  filename: string;
  /** e.g. `index.it` */
  basename: string;
  /** e.g. `md` */
  ext: string;
  /** e.g. `it` */
  locale: string | "default";
};

export type EntryMatter<T extends {}> = {
  body: string;
  data: EntryMatterData<T>;
  excerpt?: string;
};

export type EntryMatterData<T extends {}> = {
  template?: string;
  slug?: string;
  draft?: boolean;
} & T;

export type EntryRoute = {
  /** e.g. `news/some-title` */
  routeId: string;
  /** e.g. `it` */
  locale: EntryMeta["locale"];
  /** localised, e.g. `/news/some-title` or `novità/un-titolo` */
  slug: string;
  /** template folder with localised slug, e.g. e.g. `news/actual-entry-slug` */
  templateSlug: string;
};

export type Entry<T extends {} = {}> = EntryMatter<T> &
  EntryRoute & {} & EntryMeta;

export type EntriesMap<T extends {} = {}> = {
  byRoute: EntriesMapByRoute<T>;
  byTemplateSlug: EntriesMapByTemplateSlug<T>;
};

export type EntriesMapByRoute<T extends {} = {}> = Record<
  RouteId,
  Record<Locale, Entry<T>>
>;

export type EntriesMapByTemplateSlug<T extends {} = {}> = Record<
  Slug,
  Record<Locale, Entry<T>>
>;
