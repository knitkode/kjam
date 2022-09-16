export declare namespace Kjam {
  type Locale = string; // & { _branded: true};

  /** The folder path containing the entry's markdown file */
  type RouteId = string; // & { _branded: true};

  /** A single part of the URL pathname, e.g. `a-slug-path` */
  type Slug = string; // & { _branded: true};

  /** A relative URL or all the URL pathname, e.g. `/my-folder/a-slug-path` */
  type Url = string; // & { _branded: true};

  type I18n = {
    /**
     * @default ["en"]
     */
    locales: Locale[];
    /**
     * @default "en"
     */
    defaultLocale: Locale;
    /**
     * @default true
     */
    hideDefaultLocaleInUrl?: boolean;
  };

  type Slugs = Record<RouteId, Record<Locale, Slug>>;

  type Urls = Record<RouteId, Record<Locale, Url>>;

  type Routes = Record<RouteId, Record<Locale, Url>>;

  type Structure = {
    i18n: I18n;
    routes: Routes;
  };

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
  type Translations = Record<
    Locale,
    Record<
      "*" | "~" | string,
      Record<string, string | { [key: string]: string }>
    >
  >;
}

/**
 * Metadata of an entry markdown file
 */
export type EntryMeta = {
  /**
   * From  `/news/some-title/index.it.md` this value is `index.it` */
  // basename: string;
  /**
   * From  `/news/some-title/index.it.md` this value is `news/some-title` */
  dir: string;
  /**
   * From  `/news/some-title/index.it.md` this value is `md` */
  // ext: string;
  /**
   * From  `/news/some-title/index.it.md` this value is `index.it.md` */
  // filename: string;
  /**
   * From  `/news/some-title/index.it.md` this value is `it` */
  locale: Kjam.Locale;
  /**
   * From  `/news/some-title/index.it.md` this value is `news` */
  // parentDirs: string;
};

/**
 * Parsed frontmatter section of an entry
 */
export type EntryMatter<Data> = {
  /**
   * Parsed frontmatter section of an entry, it represents its "structured" data
   */
  data: EntryMatterData<Data>;
  /**
   * The rich/plain body content of an entry
   */
  body: string;
  /**
   * The cut down version of the rich/plain body content of an entry
   */
  excerpt?: string;
};

/**
 * Some basic frontmatter data an entry should/could have
 */
export type EntryMatterData<Data> = {
  draft?: boolean;
  slug?: string;
  template?: string;
} & Data;

/**
 * Routing related data of an entry
 */
export type EntryRoute = {
  /** e.g. `news/some-title` */
  id: string;
  /** static template folder path + localised slug, e.g. `news/un-titolo` */
  templateSlug: string;
  /** last portion of the entry pathname, e.g. from `novità/un-titolo` slug is 'un-titolo' */
  slug: string;
  /** full relative entry url, localised, e.g. `/news/title-not-the-same-as-folder-name` or `novità/un-titolo` */
  url: string;
};

/**
 * The full markdown file's Entry representation
 */
export type Entry<Data = {}> = EntryMatter<Data> &
  EntryRoute &
  EntryMeta;

/**
 * The lean markdown file's Entry representation, same as `Entry` but without body
 * so no mdx serializing required, useful to display entries in index pages or
 * previews of collection pages for instance.
 */
export type EntryLean<Data = {}> = Omit<Entry<Data>, "body">;

export type EntriesMap<Data = {}> = {
  byRoute: EntriesMapById<Data>;
};

export type EntriesMapById<Data = {}> = Record<
  Kjam.RouteId,
  Record<Kjam.Locale, Entry<Data>>
>;
