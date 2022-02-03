import {
  emptyDirSync,
  writeFileSync,
  ensureFileSync,
  mkdirpSync,
  existsSync,
  readFileSync,
  readFile,
} from "fs-extra";
import { fdir } from "fdir";
import { join, relative } from "path";
import { load } from "js-yaml";
import {
  Kjam,
  EntriesMapByRoute,
  EntriesMap,
  normalisePathname,
  isTestEnv,
  ApiGithub,
  ApiGithubConfig,
  Api,
} from "../../core/src"; // @kjam/core
import {
  filterMarkdownFiles,
  extractMeta,
  extractMatter,
  extractRoute,
  isCollectionPath,
  treatAllLinks,
  treatAllImages,
} from "./utils";
import { getTranslations, writeTranslations } from "./translations";
import { Img } from "./img";

type LoggerType = "info" | "error" | "warn";

type Logger = (data: any, type?: LoggerType) => void;

export type SerializerBodyImgTransformer = (
  markdownImg: string,
  baseUrl: string
) => Promise<string>;

export type SerializerConfig<T> = T & {
  api?: ApiGithubConfig;
  debug?: boolean;
  root?: string;
  /** @default "settings/i18n/config.yml" */
  pathI18n?: string;
  /** @default "settings/i18n/messages" */
  pathTranslations?: string;
  log?: Logger;
};

export class Serializer<T = Record<string, unknown>> {
  api: Api;
  config: T;
  /** Logger function */
  log: Logger;
  /** Flag for debug mode */
  readonly debug: boolean;
  /** Path where the i18n config YAML file is placed */
  readonly pathI18n: string;
  /** Path of the folder where the i18n YAML translations files are placed */
  readonly pathTranslations: string;
  /** Repository root absolute folder path */
  readonly root: string;

  i18n: Kjam.I18n;
  routes: Kjam.Routes;
  urls: Kjam.Urls;
  slugs: Kjam.Slugs;
  translations: Kjam.Translations;
  collections: Record<Kjam.RouteId, true>;
  entries: Record<Kjam.RouteId, true>;

  /**
   * All markdown files paths
   */
  mdPaths: string[];

  constructor(config?: SerializerConfig<T>) {
    const defaultLogger: Logger = (data, type = "info") => {
      console[type](data);
    };

    // @see https://docs.github.com/en/actions/learn-github-actions/environment-variables
    const [username, repo] = (process.env["GITHUB_REPOSITORY"] || "").split(
      "/"
    );
    // TODO: check if I can use GITHUB_REF_NAME
    const branch = process.env["GITHUB_REF"]?.substring(11) || "main";
    this.api = new ApiGithub({
      username,
      repo,
      branch,
      ...(config?.api || {}),
    });

    const { log, debug, pathI18n, pathTranslations, root, ...restConfig } =
      config || {};
    this.config = restConfig as T;

    this.log = log || defaultLogger;
    this.debug = !!debug || false;
    this.pathI18n = pathI18n || "settings/i18n/config.yml";
    this.pathTranslations = pathTranslations || "settings/i18n/messages";
    this.root = root || join(process.cwd(), process.env["KJAM_FOLDER"] || ".");

    this.i18n = this.getI18n();
    this.routes = {};
    this.urls = {};
    this.slugs = {};
    this.translations = {};
    this.collections = {};
    this.entries = {};
    this.mdPaths = [];
  }

  async run() {
    this.ensureMetaFolder();

    this.mdPaths = await this.getMarkdownPaths();

    this.log(`> Found ${this.mdPaths.length} markdown files.`);

    const { routes, urls, slugs, collections, entries } = await this.getRouting(
      this.mdPaths
    );
    this.routes = routes;
    this.urls = urls;
    this.slugs = slugs;
    this.collections = collections;
    this.entries = entries;

    this.writeFile("i18n", this.i18n);
    this.writeFile("routes", this.routes);
    this.writeFile("urls", this.urls);
    this.writeFile("slugs", this.slugs);
    // this.writeFile("collections", this.collections);
    // this.writeFile("entries", this.entries);

    this.translations = await getTranslations(
      join(this.root, this.pathTranslations),
      this.i18n,
      this.routes
    );

    writeTranslations(this.translations, this.writeFile.bind(this));

    const map = await this.getEntriesMap();

    await this.start();

    return map;
  }

  /**
   * Use this in subclasses as we are sure that routes structure has been
   * calculated
   *
   * @abstract
   */
  async start(): Promise<any> {
    return new Promise((resolve) => resolve(""));
  }
  // abstract start(): Promise<any>;

  /**
   * Get all files' path recursively
   */
  async getPaths(dir?: string) {
    const crawler = new fdir().withFullPaths().crawl(dir || this.root);
    const paths = (await crawler.withPromise()) as string[];
    return paths;
  }

  /** @protected */
  async getMarkdownPaths() {
    const paths = await this.getPaths();

    if (!paths) {
      this.log("Repository is empty", "error");

      throw Error("Repository is empty!");
    }

    return (
      paths
        .filter(filterMarkdownFiles)
        .map((filepath) => relative(this.root, filepath))
        // TODO: make the following more optional and better thought of
        .filter((filepath) => !filepath.startsWith("settings/"))
    );
  }

  /**
   * Make sure that the meta folder is there, always remove it and recreate it
   */
  private ensureMetaFolder() {
    const target = join(this.root, ".kjam");
    // empty folder: @see https://stackoverflow.com/a/42182416/1938970
    // fs .rmSync(target, {recursive: true, force: true})
    emptyDirSync(target);

    // fs .mkdirSync(target)
    mkdirpSync(target);
    // if (fs .existsSync(target)) {
    // }
  }

  protected writeFile(filepath = "", data: any) {
    const target = join(this.root, ".kjam", `${filepath}.json`);
    const content = JSON.stringify(data, null, isTestEnv() ? 2 : 0);

    ensureFileSync(target);

    writeFileSync(target, content);
  }

  /** @protected */
  getI18n() {
    const target = join(this.root, this.pathI18n);

    if (existsSync(target)) {
      const content = readFileSync(target, "utf-8");
      const i18n = load(content);
      return i18n as Kjam.I18n;
    }

    return {
      locales: ["en"],
      defaultLocale: "en",
    };
  }

  /**
   * Let's do everyhting in this big function. We can avoid creating too many maps
   * to pass around to other functions. It might be hard to read but let's
   * comment it properly.
   *
   * The convention is that each markdown file is in its own folder alongside
   * its translations, e.g. we could have:
   *
   * ```
   * projects/wood/boxes/index.en.md
   * projects/wood/boxes/index.it.md
   * ```
   *
   * What we are interested in here is just the `projects/wood` bit as the
   * `boxes` folder is not the folder in terms of URL as it behaves like the entry
   * `slug`, in other words the last portion of the URL pathname. In fact this
   * content entry will be probably reachable at something like these URLS:
   *
   * ```
   * https://example.com/projects/wood/boxes (en)
   * https://example.com/it/progetti/legno/scatole (it)
   * ```
   *
   * @private
   */
  async getRouting(markdownFiles: string[]) {
    // const folderPaths = await this.getAllFolderPaths(markdownFiles);
    const slugs: Kjam.Slugs = {};
    const urls: Kjam.Urls = {};
    const routes: Kjam.Routes = {};
    const collections: Record<string, true> = {};
    const entries: Record<string, true> = {};
    const BLACKLISTED_PATHS = ["settings"];

    // Pass 1: divide all the markdown paths between `entries` and `collections`
    for (let i = 0; i < markdownFiles.length; i++) {
      const pathParts = normalisePathname(markdownFiles[i]).split("/");
      let path = pathParts.slice(0, -1).join("/");
      const isCollection = isCollectionPath(join(this.root, path));
      // pages collection is treated as if it was at the root level
      path = path.replace("pages/", "");

      let exclude = false;
      // exclude e.g. `settings`
      if (BLACKLISTED_PATHS.indexOf(path) > -1) {
        exclude = true;
      } else {
        // exclude e.g. `settings/categores`
        for (let i = 0; i < BLACKLISTED_PATHS.length; i++) {
          if (path.startsWith(`${BLACKLISTED_PATHS[i]}/`)) {
            exclude = true;
          }
        }
      }

      if (!exclude && path) {
        if (isCollection) {
          collections[path] = true;
        } else {
          entries[path] = true;
        }

        slugs[path] = this.getSlugsForPath(path);
      }
    }

    const all = { ...collections, ...entries };

    // Pass 2: loop through each entry path and construct the output maps
    for (const path in all) {
      const pathParts = path.split("/");
      const locales = slugs[path];

      // if it's a one level path we do not need to do anything more
      if (pathParts.length <= 1) {
        routes[path] = locales;
        urls[path] = locales;
      } else {
        // otherwise we need to loop through each portion of the route and pick
        // each segment's translation from the previously constructed map
        for (const locale in locales) {
          let pathTarget = "";
          let url = "";

          // loop through each part of the route key (e.g. /spaces/outdoor/seasons)
          // and translate each segment
          for (let j = 0; j < pathParts.length; j++) {
            pathTarget = `${pathTarget ? pathTarget + "/" : ""}${pathParts[j]}`;
            // use the path part as fallback, which means that if a folder does
            // not have an entry we use its folder name as part of its children's
            // url pathnames
            const folderBasedSlugSegment = `/${pathParts[j]}`;
            const existingSlugSegment = slugs[pathTarget]?.[locale];
            const slugSegment = existingSlugSegment || folderBasedSlugSegment;

            if (!existingSlugSegment) {
              // console.log("folderBasedSlugSegment", Object.keys(slugs), pathTarget);
              // add to the `routes` the url to construct links of the nested
              // entries, no need to add it to the `urls` map as it does not make
              // sense to link directly to this URL, it is only an empty folder
              // pathname
              const routeWithoutEntry = pathTarget;
              const urlWithoutEntry = routeWithoutEntry
                .split("/")
                .map((path) => slugs?.[path]?.[locale] || path)
                .join("/");
              routes[routeWithoutEntry] = routes[routeWithoutEntry] || {};
              routes[routeWithoutEntry][locale] = urlWithoutEntry;
            }

            url += slugSegment;
          }

          // add to the `routes` structure only the collections pages
          if (collections[path]) {
            routes[path] = routes[path] || {};
            routes[path][locale] = url;
          }

          urls[path] = urls[path] || {};
          urls[path][locale] = url;
        }
      }
    }

    return { routes, urls, slugs, collections, entries };
  }

  /** @private */
  private getSlugsForPath(path: string) {
    const pathSlugs: Kjam.Routes[string] = {};

    for (let i = 0; i < this.i18n.locales.length; i++) {
      const locale = this.i18n.locales[i];
      // Should we check `mdx` too? I don't think so...
      const filename = `index.${locale}.md`;
      const pageEntry = join(
        this.root,
        path === "pages" ? `${path}` : `pages/${path}`,
        filename
      );
      let existingEntry = "";
      let slug;

      // first check if we have a specific page entry for this path in
      // `pages` folder
      if (existsSync(pageEntry)) {
        existingEntry = pageEntry;
      } else {
        // otherwise check if we have a specific page entry for this path in
        // its `{path}` collection folder
        const collectionEntry = join(this.root, path, filename);
        if (existsSync(collectionEntry)) {
          existingEntry = collectionEntry;
        }
      }

      // if we have an entry we try to read the slug from the raw file
      if (existingEntry) {
        slug = this.getSlugFromRawMdFile(existingEntry);
      }

      // it might be that the entry markdown file does not specify a slug or that
      // a collection folder might not have an `index` file, in these case URLS
      // will be constructed by simply using the folder name as it is, as we can
      // have entries that are fine with using their folder name as slug and
      // have nested collections that are only meant for organizing the content
      // structure. So we just use the last portion of the `path`.
      if (!slug) {
        // special case for homepage, if no slug is specified in the markdown
        // file (probably it should never be) we just hardcode the empty path
        if (path === "home") {
          slug = "/";
        } else {
          const pathParts = path.split("/");
          slug = pathParts[pathParts.length - 1];
        }
      }

      pathSlugs[locale] = "/" + normalisePathname(slug);
    }

    return pathSlugs;
  }

  /**
   * We want to be quick here, just using a regex is fine for now avoiding
   * `frontmatter` parsing at this phase of the serialization
   *
   * @private
   */
  private getSlugFromRawMdFile(filepath: string) {
    const content = readFileSync(filepath, "utf-8");
    const regex = /slug:[\s|\n]+(.+)$/m;
    const matches = content.match(regex);

    if (matches && matches[1]) {
      // use the last bit only of the pathname, declaring a composed path is not
      // allowed as each entry should just define its slug and not its ancestor's
      // ones (which are inferred in the serialization phase).
      const matchParts = matches[1].split("/");
      return matchParts[matchParts.length - 1];
    }

    return "";
  }

  /** @private */
  async getRawFile(filepath: string) {
    try {
      return await readFile(join(this.root, filepath), "utf-8");
    } catch (e) {
      if (this.debug) {
        console.warn(
          `kjam/serializer::getRawFile failed to read ${filepath}`,
          e
        );
      }
      return null;
    }
  }

  /** @private */
  async getEntriesMap() {
    const entries = await Promise.all(
      this.mdPaths.map(async (mdPath) => {
        const raw = await this.getRawFile(mdPath);

        if (raw === null) {
          return null;
        }

        const meta = extractMeta(mdPath, this.i18n);
        const matter = extractMatter<T>(join(this.root, mdPath));
        const route = extractRoute<T>(meta, matter, this.urls);

        // ability to filter out contents with conventional frontmatter flags
        if (matter.data.draft) {
          return null;
        }

        const entry = treatAllLinks(
          {
            ...meta,
            ...matter,
            ...route,
          },
          this.urls
        );

        return await treatAllImages(entry, this.api, this.transformBodyImage);
      })
    );

    const byRoute = entries
      .filter((content) => !!content)
      .reduce((map, item) => {
        if (item) {
          map[item.id] = map[item.id] || {};
          map[item.id][item.locale] = item;
        }
        return map;
      }, {} as EntriesMapByRoute);

    const entriesMap = {
      byRoute,
    } as EntriesMap;

    this.writeFile("byRoute", byRoute);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_id, locales] of Object.entries(byRoute)) {
      for (const [locale, entry] of Object.entries(locales)) {
        const { id, templateSlug } = entry;

        this.writeFile(`entries/${id}__${locale}`, entry);

        // FIXME: still not sure what is the best here, maybe the template slug
        // is only needed for next.js routing system, maybe not, right now we
        // are creating multiple endpoints for the same entry, which is probably
        // not ideal
        // if (!this.collections[id]) {
        this.writeFile(`entries/${templateSlug}__${locale}`, entry);
        // }
      }
    }

    return entriesMap;
  }

  async transformBodyImage(markdownImg: string, baseUrl: string) {
    const img = new Img(markdownImg, baseUrl);
    return await img.toComponent();
  }
}
