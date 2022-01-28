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
  Structure,
  EntriesMapByRoute,
  EntriesMapByTemplateSlug,
  EntriesMap,
  SiteTranslations,
  normalisePathname,
} from "../../core/src"; // @kjam/core
import {
  filterMarkdownFiles,
  extractMeta,
  extractMatter,
  extractRoute,
} from "./utils";
import { getTranslations, writeTranslations } from "./translations";

type LoggerType = "info" | "error" | "warn";

type Logger = (data: any, type?: LoggerType) => void;

type SerializerConfig<T> = T & {
  debug?: boolean;
  root?: string;
  /** @default "settings/i18n/config.yml" */
  pathI18n?: string;
  /** @default "settings/i18n/messages" */
  pathTranslations?: string;
  log?: Logger;
};

export class Serializer<T = Record<string, unknown>> {
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

  routes: Structure["routes"];
  i18n: Structure["i18n"];
  translations: SiteTranslations;

  /**
   * All markdown files paths
   */
  mdPaths: string[];

  constructor(config?: SerializerConfig<T>) {
    const defaultLogger: Logger = (data, type = "info") => {
      console[type](data);
    };

    const { log, debug, pathI18n, pathTranslations, root, ...restConfig } =
      config || {};
    this.config = restConfig as T;

    this.log = log || defaultLogger;
    this.debug = !!debug || false;
    this.pathI18n = pathI18n || "settings/i18n/config.yml";
    this.pathTranslations = pathI18n || "settings/i18n/messages";
    this.root = root || join(process.cwd(), process.env["KJAM_GIT_FS"] || ".");

    this.i18n = this.getI18n();
    this.routes = {};
    this.translations = {};
    this.mdPaths = [];
  }

  async run() {
    this.ensureMetaFolder();

    this.mdPaths = await this.getMarkdownPaths();

    this.log(`> Found ${this.mdPaths.length} markdown files.`);

    this.routes = this.getRoutes(this.mdPaths);

    this.writeFile("structure", {
      i18n: this.i18n,
      routes: this.routes,
    });

    this.translations = getTranslations(
      join(this.root, this.pathTranslations),
      {
        routes: this.routes,
        i18n: this.i18n,
      }
    );

    writeTranslations(this.translations, this.writeFile.bind(this));

    await this.getEntriesMap();

    await this.start();

    return;
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
    const content = JSON.stringify(data, null, 2);

    ensureFileSync(target);

    writeFileSync(target, content);
  }

  /** @protected */
  getI18n() {
    const target = join(this.root, this.pathI18n);

    if (existsSync(target)) {
      const content = readFileSync(target, "utf-8");
      const i18n = load(content);
      return i18n as Structure["i18n"];
    }

    return {
      locales: ["en"],
      defaultLocale: "en",
    };
  }

  /**
   * @private
   */
  getRoutes(markdownFiles: string[]) {
    const folderPaths = this.getAllFolderPaths(markdownFiles);
    console.log("folderPaths", folderPaths);
    const routes: Structure["routes"] = {};

    for (let i = 0; i < folderPaths.length; i++) {
      const folderPath = folderPaths[i];
      const slugs = this.findFolderPathSlugs(folderPath);
      const routeKey = folderPath.replace("pages/", "");

      if (slugs) {
        routes[routeKey] = slugs;
      }
    }

    return routes;
  }

  /**
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
  getAllFolderPaths(markdownFiles: string[]) {
    const map: Record<string, boolean> = {};
    const blacklistedFolderPaths = [/* "pages", */ "settings"];

    for (let i = 0; i < markdownFiles.length; i++) {
      const relativePath = markdownFiles[i];
      const parts = relativePath.split("/").filter((part) => !!part);
      // treat pages collection as if it is in the root folder
      const idx = parts[0] === "pages" ? 1 : 2;
      const folderPath =
        parts.length > idx ? parts.slice(0, -idx).join("/") : "";

      map[folderPath] = true;
    }

    return Object.keys(map).filter((folderPath) => {
      // exclude e.g. `pages`
      if (blacklistedFolderPaths.indexOf(folderPath) > -1) {
        return false;
      }
      // exclude e.g. `settings/categores`
      for (let i = 0; i < blacklistedFolderPaths.length; i++) {
        const blacklistedFolderPath = blacklistedFolderPaths[i];

        if (folderPath.startsWith(`${blacklistedFolderPath}/`)) {
          return false;
        }
      }
      return true;
    });
  }
  // getAllFolderPaths(markdownFiles: string[]) {
  //   const map: Record<string, boolean> = {};
  //   const blacklistedFolderPaths = [/* "pages", */ "settings"];

  //   for (let i = 0; i < markdownFiles.length; i++) {
  //     const relativePath = markdownFiles[i];
  //     console.log("relativePath", relativePath)
  //     const parts = relativePath.split("/").filter((part) => !!part);
  //     const folderPath = parts.length > 2 ? parts.slice(0, -2).join("/") : "";
  //     map[folderPath] = true;
  //   }

  //   return Object.keys(map).filter((folderPath) => {
  //     // exclude e.g. `pages`
  //     if (blacklistedFolderPaths.indexOf(folderPath) > -1) {
  //       return false;
  //     }
  //     // exclude e.g. `settings/categores`
  //     for (let i = 0; i < blacklistedFolderPaths.length; i++) {
  //       const blacklistedFolderPath = blacklistedFolderPaths[i];

  //       if (folderPath.startsWith(`${blacklistedFolderPath}/`)) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   });
  // }

  /** @private */
  findFolderPathSlugs(folderPath: string) {
    const slugs: Structure["routes"][string] = {};

    for (let i = 0; i < this.i18n.locales.length; i++) {
      let existingEntry = "";
      const locale = this.i18n.locales[i];
      // Should we check `mdx` too? I don't think so...
      const filename = `index.${locale}.md`;
      const pageEntryLocation = folderPath === "pages" ? "" : "pages";
      const pageEntry = join(
        this.root,
        pageEntryLocation,
        folderPath,
        filename
      );

      // first check if we have a specific page entry for this folderPath in
      // `pages` folder
      if (existsSync(pageEntry)) {
        existingEntry = pageEntry;
      } else {
        // otherwise check if we have a specific page entry for this folderPath in
        // its `{folderPath}` collection folder
        const collectionEntry = join(this.root, folderPath, filename);
        if (existsSync(collectionEntry)) {
          existingEntry = collectionEntry;
        }
      }

      if (existingEntry) {
        const slug = this.getSlugFromRawFile(existingEntry);

        // special case for homepage, if no slug is specified in the markdown
        // file, and it should never be probably we just hardcode the empty path
        if (!slug && folderPath === "pages/home") {
          slugs[locale] = "/";
        } else {
          slugs[locale] = "/" + normalisePathname(slug || folderPath);
        }
      }
    }

    return Object.keys(slugs).length ? slugs : null;
  }

  /** @private */
  getSlugFromRawFile(filepath: string) {
    const content = readFileSync(filepath, "utf-8");
    const regex = /slug:[\s|\n]+(.+)$/m;
    const matches = content.match(regex);

    if (matches && matches[1]) {
      return matches[1];
    }

    return "";
  }

  /** @private */
  async getRawFile(filepath: string) {
    try {
      return await readFile(join(this.root, filepath), "utf-8");
    } catch (e) {
      console.warn(`Failed to read file ${filepath}`, e);
      return null;
    }
  }

  /** @private */
  async getEntriesMap() {
    const { mdPaths } = this;
    const output = await Promise.all(
      mdPaths.map(async (mdPath) => {
        const raw = await this.getRawFile(mdPath);

        if (raw === null) {
          return null;
        }

        const meta = extractMeta(mdPath);
        const matter = extractMatter<T>(join(this.root, mdPath));
        const route = extractRoute<T>(meta, matter);

        // ability to filter out contents with conventional frontmatter flags
        if (matter.data.draft) {
          return null;
        }
        return {
          ...meta,
          ...matter,
          ...route,
          // path,
        };
      })
    );

    const byRoute = output
      .filter((content) => !!content)
      .reduce((map, item) => {
        if (item) {
          map[item.routeId] = map[item.routeId] || {};
          map[item.routeId][item.locale] = item;
        }
        return map;
      }, {} as EntriesMapByRoute);

    const byTemplateSlug = output.reduce((map, item) => {
      if (item) {
        map[item.templateSlug] = map[item.templateSlug] || {};
        map[item.templateSlug][item.locale] = item;
      }
      return map;
    }, {} as EntriesMapByTemplateSlug);

    // const bySlug = output
    //   .reduce((map, item) => {
    //     if (item) {
    //       map[item.slug] = item;
    //     }
    //     return map;
    //   }, {} as EntriesMapBySlug);

    const entriesMap = {
      byRoute,
      byTemplateSlug,
      // bySlug,
    } as EntriesMap;

    this.writeFile("byRoute", byRoute);
    this.writeFile("byTemplateSlug", byTemplateSlug);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_routeId, routeLocales] of Object.entries(byRoute)) {
      for (const [routeLocale, route] of Object.entries(routeLocales)) {
        const { templateSlug } = route;

        this.writeFile(`entries/${templateSlug}__${routeLocale}`, route);

        // const templateSlugParts = templateSlug.split("/");
        // for (let i = 0; i < templateSlugParts.length; i++) {
        //   const parts = templateSlugParts[i];
        // }
      }
    }

    return entriesMap;
  }
}
