'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fsExtra = require('fs-extra');
var grayMatter = require('gray-matter');
var jsYaml = require('js-yaml');
var core = require('@kjam/core');
var path = require('path');
var fdir = require('fdir');

/**
 * Only keep `.md` and `.mdx` files based on filename
 */
function filterMarkdownFiles(filenameOrPath) {
    return filenameOrPath.endsWith(".md") || filenameOrPath.endsWith(".mdx");
}
function extractMeta(filepath, i18n) {
    const pathParts = filepath.split("/");
    const filename = pathParts[pathParts.length - 1];
    // clean directory from path, e.g. "./news/a-title/index.it.md" to "news/a-title"
    const dir = core.normalisePathname(pathParts.slice(0, -1).join("/").replace(/\./g, ""));
    // const dirParts = dir.split("/");
    // const parentDirs = dirParts.slice(0, -1).join("/");
    const filenameParts = filename.split(".");
    // const ext = filenameParts[filenameParts.length - 1];
    // const basename = filename.replace(`.${ext}`, "");
    const locale = filenameParts.length > 2
        ? filenameParts[filenameParts.length - 2]
        : i18n.defaultLocale;
    return {
        dir,
        // parentDirs,
        // filename,
        // basename,
        // ext,
        locale: locale,
    };
}
/**
 * Quickly clean markdown specific syntax and mdx imports and components
 */
function getExcerpt(content, maxChars = 160) {
    const cleaned = content.replace(/<[\n|\s|\S|.]*?>|\n|!\[.*?\]|\[|\]|\(.*?\)|#.*?\n|import\s.*?\n|\*|\*\*|_|__|>.*?\n/gm, "");
    let truncated = cleaned.slice(0, maxChars + 0);
    if (cleaned.length > maxChars) {
        truncated += "...";
    }
    return truncated;
}
function extractMatter(filepath) {
    const { content, excerpt, data } = grayMatter.read(filepath, {
        excerpt: true,
        engines: {
            // turn off automatic date parsing
            // @see https://github.com/jonschlinkert/gray-matter/issues/62#issuecomment-577628177
            // @ts-expect-error I don't think this is important
            yaml: (s) => jsYaml.load(s, { schema: jsYaml.JSON_SCHEMA }),
        },
    });
    return {
        body: content,
        excerpt: excerpt || getExcerpt(content),
        data: data,
    };
}
function extractRoute(meta, matter) {
    const { dir } = meta;
    const dirParts = dir.split("/");
    const matterSlugParts = matter.data?.slug?.split("/") ?? [];
    // pages ids get the `pages/` part stripped out to act as root level routes
    // PAGES:
    // const id = dir.replace("pages/", "");
    const id = dir;
    // get the parent path of the entry's directory
    const parentDirs = dirParts
        .slice(0, -1)
        .join("/")
        // PAGES: 
        .replace(/(pages\/*).*$/, "");
    // use last portion of the frontmatter defined `slug` key as priority slug
    const slugFromMatter = matterSlugParts[matterSlugParts.length - 1];
    // use last portion of the directory/id as fallback slug
    const slugFromDir = dirParts[dirParts.length - 1];
    // normalize the slug
    let slug = core.normalisePathname(slugFromMatter || slugFromDir || "");
    // special homepage case
    slug = slug === "home" ? "" : slug;
    const templateSlug = core.normalisePathname(`${parentDirs}/${slug}`);
    // const url = (urlPrepend ? `${urlPrepend}/` : urlPrepend) + slug;
    // remove the slug from frontmatter to avoid ambiguity, that one is
    // just represents what is coming from the CMS 'database' but the one to
    // use is the `slug` at the root level of the entry object
    delete matter.data.slug;
    return {
        id,
        templateSlug,
        slug: "",
        url: "",
    };
}
/**
 * Check if the given folder path is a folder containing a collection of entries
 */
function isCollectionPath(fullpath) {
    if (!fsExtra.existsSync(fullpath)) {
        return false;
    }
    const children = fsExtra.readdirSync(fullpath, { withFileTypes: true });
    return (children.filter((dirent) => {
        const isDir = dirent.isDirectory();
        if (!isDir)
            return false;
        const { name } = dirent;
        // TODO: test for this behaviour...
        return name !== "media" && name !== "photos" && name !== "images";
    }).length > 0);
}
async function replaceAsync(str, regex, asyncFn) {
    const promises = [];
    // @ts-expect-error FIXME: No time for this...
    str.replace(regex, (...args) => {
        promises.push(asyncFn(...args));
    });
    const data = await Promise.all(promises);
    // @ts-expect-error FIXME: No time for this...
    return str.replace(regex, () => data.shift());
}
function parseUrl(url = "") {
    const [path, query] = url.split("?");
    const params = Object.fromEntries(new URLSearchParams(query));
    const relative = /^(?!\/\/)[.|/]/.test(path);
    const ext = path.match(/.+(\.[a-zA-Z0-9]+)$/)?.[1];
    return {
        path,
        query: query ? `?${query}` : "",
        params,
        relative,
        file: !!ext,
        ext,
    };
}

// import probe from "probe-image-size";
class Img {
    // baseUrl: string;
    md;
    originalUrl;
    alt;
    source;
    // width?: number;
    // height?: number;
    constructor(markdownString = "") {
        this.md = markdownString;
        this.originalUrl = "";
        this.parseMarkdown();
    }
    parseMarkdown() {
        const regex = /!\[(.+)\]\((.+)\)/;
        const matches = this.md.match(regex);
        if (matches) {
            const alt = matches[1];
            const source = matches[2];
            // const isRelative = source.startsWith(".");
            // const relativeUrl = isRelative ? source.replace(/^\./, "") : "";
            // this.originalUrl = relativeUrl ? this.baseUrl + relativeUrl : source;
            this.originalUrl = source;
            this.alt = alt;
        }
    }
    async getInfoFromParams() {
        const { params } = parseUrl(this.originalUrl);
        const width = Number(params.width || params.w) || 0;
        const height = Number(params.height || params.h) || 0;
        const ratio = params.ratio || "";
        // console.log("kjam/img::getInfoFromParams originalUrl is", this.originalUrl);
        // const start = performance.now();
        // const { width, height } = await probe(this.originalUrl);
        // console.log(`kjam/img:getInfoFromParams took ${performance.now() - start}ms for image at url ${this.originalUrl}`);
        return { width, height, ratio };
    }
    /**
     * Expected output:
     * ```md
     * ![text](https://ciao.com/path-to-img.jpg)
     * ```
     */
    // async toMarkdown() {
    //   const imgRegex = /(!\[.+\])\((\.)(.+)\)/gm;
    //   const imgSubst = `$1(${this.baseUrl}$3)`;
    //   const output = this.md.replace(imgRegex, imgSubst);
    //   return output;
    // }
    /**
     * Expected output:
     * ```jsx
     * <Img alt="text" src="https://ciao.com/path-to-img.jpg"/>
     * ```
     */
    async toComponent(attrs) {
        const { width, height, ratio } = await this.getInfoFromParams();
        let attributes = `src="${this.originalUrl}" alt="${this.alt}"`;
        attributes += width ? ` width={${width}}` : "";
        attributes += height ? ` height={${height}}` : "";
        attributes += ratio ? ` ratio="${ratio}"` : "";
        if (attrs) {
            attributes += ` ${attrs}`;
        }
        return `<Img ${attributes} />`;
    }
    /**
     * Expected output:
     * ```html
     * <img alt="text" src="https://ciao.com/path-to-img.jpg" />
     * ```
     *
     * @see https://regex101.com/r/slDmIl/1
     */
    async toHtml() {
        const { width, height, ratio } = await this.getInfoFromParams();
        let attributes = `src="${this.originalUrl}" alt="${this.alt}"`;
        attributes += width ? ` width="${width}"` : "";
        attributes += height ? ` height="${height}"` : "";
        attributes += ratio ? ` data-ratio="${ratio}"` : "";
        return `<img ${attributes} />`;
    }
}

/**
 * Get entry's `body` managing images
 */
async function treatBodyImages(entry, api, mdImgTransformer) {
    const regex = /!\[(.+)\][\s|\S]*?\((.+)\)/gm;
    let { body } = entry;
    body = await replaceAsync(body, regex, async (match) => {
        return await mdImgTransformer(match);
    });
    return body;
}
/**
 * Get entry managing images in `data`
 */
// async function treatDataImages<T>(entry: any, api: Api) {
//   for (const key in entry.data) {
//     if (key !== "body") {
//       treatDataImagesSlice(entry.data, key, entry.dir, api);
//     }
//   }
//   return entry as Entry<T>;
// }
/**
 * Get entry managing all images both in` body` and `data`
 *
 * There is no need to treat the dataImages as they are just plain urls already
 * treated by the `treatAllLinks` function. We do instead apply an image
 * specific transform inside the body where we can use MDX components.
 */
async function treatAllImages(entry, api, mdImgTransformer) {
    // entry = await treatDataImages(entry, api);
    entry.body = await treatBodyImages(entry, api, mdImgTransformer);
    return entry;
}
// function treatDataImagesSlice(data: any, key: any, baseDir: string, api: Api) {
//   if (typeof data[key] === "string") {
//     const currentValue = data[key];
//     if (
//       currentValue.endsWith(".jpg") ||
//       currentValue.endsWith(".jpeg") ||
//       currentValue.endsWith(".png")
//     ) {
//       data[key] = api.getUrl(join(baseDir, currentValue));
//       // console.log("transformed: ", data[key]);
//     }
//   } else if (Array.isArray(data[key])) {
//     // console.log("is array", key);
//     for (let i = 0; i < data[key].length; i++) {
//       treatDataImagesSlice(data[key], i, baseDir, api);
//     }
//   } else if (
//     Object.prototype.toString.call(data[key]).slice(8, -1) === "Object"
//   ) {
//     // console.log("is object", key);
//     for (const subkey in data[key]) {
//       treatDataImagesSlice(data[key], subkey, baseDir, api);
//     }
//   }
// }

/**
 * Get translated link
 *
 */
function getTranslatedLink(raw, entry, api, urls) {
    let id = "";
    const { path: path$1, relative, file, query } = parseUrl(raw);
    if (!relative) {
        return raw;
    }
    const startsWithDot = path$1[0] === ".";
    if (startsWithDot) {
        const relativePath = path$1.replace(/\/index\..+/, "");
        id = path.join(entry.dir, relativePath);
    }
    else {
        id = core.normalisePathname(path$1);
    }
    if (file) {
        return `${api.getUrl(id)}${query}`;
    }
    return urls[id]?.[entry.locale] || raw;
    // raw.match(/[\.|\/]*(.+)/)[1]
}
/**
 * Get entry's `body` managing links
 */
function treatBodyLinks(entry, api, urls) {
    // support for returns within title or href:
    // const regex = /\[([\s|\S|.]*?)\][\s|\S]*?\(([\s|\S|.]+?)\)/gm;
    const regex = /\[(.+)\][\s|\S]*?\((.+)\)/gm;
    let { body } = entry;
    body = body.replace(regex, (_match, text, url) => {
        return `[${text}](${getTranslatedLink(url, entry, api, urls)})`;
    });
    return body;
}
/**
 * Get entry managing links in `data`
 */
function treatDataLinks(entry, api, urls) {
    for (const key in entry.data) {
        if (key !== "body") {
            treatDataLinksSlice(entry.data, key, entry, api, urls);
        }
    }
    return entry;
}
/**
 * Get entry managing all links both in` body` and `data`
 */
function treatAllLinks(entry, api, urls) {
    entry = treatDataLinks(entry, api, urls);
    entry.body = treatBodyLinks(entry, api, urls);
    return entry;
}
function treatDataLinksSlice(data, key, entry, api, urls) {
    if (typeof data[key] === "string") {
        const currentValue = data[key];
        if (/^([\s|.]*\/)+/.test(currentValue)) {
            data[key] = getTranslatedLink(currentValue, entry, api, urls);
            // console.log("transformed: ", data[key]);
        }
        else {
            const regex = /(\[[\s|\S]*?\])\(([\s\S]*?)\)/gm;
            data[key] = currentValue.replace(regex, (_, text, url) => {
                if (text && url) {
                    return `${text}(${getTranslatedLink(url, entry, api, urls)})`;
                }
                return _;
            });
        }
    }
    else if (Array.isArray(data[key])) {
        // console.log("is array", key);
        for (let i = 0; i < data[key].length; i++) {
            treatDataLinksSlice(data[key], i, entry, api, urls);
        }
    }
    else if (Object.prototype.toString.call(data[key]).slice(8, -1) === "Object") {
        // console.log("is object", key);
        for (const subkey in data[key]) {
            treatDataLinksSlice(data[key], subkey, entry, api, urls);
        }
    }
}

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
const TRANSLATIONS_CHARS = {
    common: "_",
    route: "~",
};
const TRANSLATIONS_REGEX = {
    route: /~/g,
};
function buildNestedTranslations(outBuffer, keyParts, value) {
    for (let i = 0; i < keyParts.length; i++) {
        const key = keyParts[i];
        if (i === keyParts.length - 1) {
            // @ts-expect-error nevermind...
            outBuffer[key] = value;
        }
        else {
            // @ts-expect-error nevermind...
            outBuffer[key] = outBuffer[key] || {};
            keyParts.splice(i, 1);
            // @ts-expect-error nevermind...
            buildNestedTranslations(outBuffer[key], keyParts, value);
        }
    }
}
async function getTranslations(folderPath, i18n, routes) {
    const { locales } = i18n;
    const out = {};
    const { common: commonChar, route: routeChar } = TRANSLATIONS_CHARS;
    const { route: routeReg } = TRANSLATIONS_REGEX;
    for (let i = 0; i < locales.length; i++) {
        const locale = locales[i];
        const target = path.join(folderPath, `${locale}.yml`);
        let data;
        try {
            const content = await fsExtra.readFile(target, "utf-8");
            data = jsYaml.load(content);
        }
        catch (_e) {
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
                        console.error(`kjam/Serializer::getTranslations, problem found with ` +
                            `'${key}' in file '${target}', only '_common' ` +
                            `translations can have no dots in the key.\n`);
                    }
                    else {
                        const scoped = keyParts[0];
                        out[locale][commonChar] = out[locale][scoped] || {};
                        out[locale][commonChar][keyParts[0]] = value;
                    }
                }
                else if (keyParts.length >= 2) {
                    const file = isCommon
                        ? commonChar
                        : keyParts[0].replace(routeReg, "");
                    if (isCommon) {
                        const scoped = keyParts[0];
                        out[locale][file][scoped] = out[locale][file][scoped] || {};
                        buildNestedTranslations(out[locale][file][scoped], keyParts.slice(1), value);
                    }
                    else {
                        const file = keyParts[0].replace(routeReg, "");
                        out[locale][file] = out[locale][file] || {};
                        buildNestedTranslations(out[locale][file], keyParts.slice(1), value);
                    }
                }
            }
        }
    }
    // automatically build translations for routes paths
    for (const route in routes) {
        const locales = routes[route];
        for (const _locale in locales) {
            const locale = _locale;
            const slug = locales[locale];
            out[locale][TRANSLATIONS_CHARS.route] =
                out[locale][TRANSLATIONS_CHARS.route] || {};
            out[locale][TRANSLATIONS_CHARS.route][`/${route}`] = slug;
        }
    }
    return out;
}
function writeTranslations(translations, write) {
    for (const _locale in translations) {
        const locale = _locale;
        for (const fileName in translations[locale]) {
            const fileData = translations[locale][fileName];
            write(`i18n/${locale}/${fileName}`, fileData);
        }
    }
}

// import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
class Serializer {
    api;
    config;
    /** Logger function */
    log;
    /** Flag for debug mode */
    debug;
    /** Path where the i18n config YAML file is placed */
    pathI18n;
    /** Path of the folder where the i18n YAML translations files are placed */
    pathTranslations;
    /** Repository root absolute folder path */
    root;
    i18n;
    routes;
    urls;
    slugs;
    translations;
    collections;
    entries;
    /**
     * All markdown files paths
     */
    mdPaths;
    constructor(config) {
        const defaultLogger = (data, type = "info") => {
            console[type](data);
        };
        // @see https://docs.github.com/en/actions/learn-github-actions/environment-variables
        const [username, repo] = (process.env["GITHUB_REPOSITORY"] || "").split("/");
        // TODO: check if I can use GITHUB_REF_NAME
        const branch = process.env["GITHUB_REF"]?.substring(11) || "main";
        this.api = new core.ApiGithub({
            username,
            repo,
            branch,
            ...(config?.api || {}),
        });
        const { log, debug, pathI18n, pathTranslations, root, ...restConfig } = config || {};
        this.config = restConfig;
        this.log = log || defaultLogger;
        this.debug = !!debug || false;
        this.pathI18n = pathI18n || "settings/i18n/config.yml";
        this.pathTranslations = pathTranslations || "settings/i18n/messages";
        this.root = root || path.join(process.cwd(), process.env["KJAM_FOLDER"] || ".");
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
        const { routes, urls, slugs, collections, entries } = await this.getRouting(this.mdPaths);
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
        this.translations = await getTranslations(path.join(this.root, this.pathTranslations), this.i18n, this.routes);
        writeTranslations(this.translations, this.writeFile.bind(this));
        this.writeFile("byRoute", this.entries);
        // const map = await this.getEntriesMap();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [id, locales] of Object.entries(this.entries)) {
            // FIXME: using the following would help creating staticlly Untranslated Pages...
            // for (const [locale, entry] of Object.entries(this.i18n.locales)) {
            for (const [locale, entry] of Object.entries(locales)) {
                // PAGES:
                // if (!id.startsWith("pages/")) {
                this.writeFile(`entries/${id}__${locale}`, entry);
                // }
                // FIXME: still not sure what is the best here, maybe the template slug
                // is only needed for next.js routing system, maybe not, right now we
                // are creating multiple endpoints for the same entry, which is probably
                // not ideal
                const { templateSlug } = entry;
                // if (!this.collections[id]) {
                this.writeFile(`entries/${templateSlug}__${locale}`, entry);
                // }
            }
        }
        await this.start();
        return { byRoute: this.entries };
    }
    /**
     * Use this in subclasses as we are sure that routes structure has been
     * calculated
     *
     * @abstract
     */
    async start() {
        return new Promise((resolve) => resolve(""));
    }
    /**
     * Get all files' path recursively
     */
    async getPaths(dir) {
        const crawler = new fdir.fdir().withFullPaths().crawl(dir || this.root);
        const paths = (await crawler.withPromise());
        return paths;
    }
    /** @protected */
    async getMarkdownPaths() {
        const paths = await this.getPaths();
        if (!paths) {
            this.log("Repository is empty.", "error");
            throw Error("Repository is empty!");
        }
        return (paths
            .filter(filterMarkdownFiles)
            .map((filepath) => path.relative(this.root, filepath))
            // TODO: make the following more optional and better thought of
            .filter((filepath) => !filepath.startsWith("settings/")));
    }
    /**
     * Make sure that the meta folder is there, always remove it and recreate it
     */
    ensureMetaFolder() {
        const target = path.join(this.root, ".kjam");
        fsExtra.emptyDirSync(target);
        fsExtra.mkdirSync(target, { recursive: true });
    }
    writeFile(filepath = "", data) {
        const target = path.join(this.root, ".kjam", `${filepath}.json`);
        const dir = path.dirname(target);
        const content = JSON.stringify(data, null, core.isTestEnv() ? 2 : 0);
        if (!fsExtra.existsSync(dir)) {
            fsExtra.mkdirSync(dir, { recursive: true });
        }
        fsExtra.writeFileSync(target, content);
    }
    /** @protected */
    getI18n() {
        const target = path.join(this.root, this.pathI18n);
        if (fsExtra.existsSync(target)) {
            const content = fsExtra.readFileSync(target, "utf-8");
            const i18n = jsYaml.load(content);
            return i18n;
        }
        return {
            locales: ["en"],
            defaultLocale: "en",
        };
    }
    shouldExcludeFilePath(dirAsId) {
        const BLACKLISTED = ["settings"];
        let exclude = false;
        // exclude e.g. `settings`
        if (BLACKLISTED.indexOf(dirAsId) > -1) {
            exclude = true;
        }
        else {
            // exclude e.g. `settings/categores`
            for (let i = 0; i < BLACKLISTED.length; i++) {
                if (dirAsId.startsWith(`${BLACKLISTED[i]}/`)) {
                    exclude = true;
                }
            }
        }
        return exclude;
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
    async getRouting(markdownFiles) {
        const ids = {};
        const entries = {};
        const slugs = {};
        const urls = {};
        const routes = {};
        const collections = {};
        // Pass 1: gather all the markdown paths and build the `entries` map flagging
        // those that are `collections`
        for (let i = 0; i < markdownFiles.length; i++) {
            const filepath = markdownFiles[i];
            const meta = extractMeta(filepath, this.i18n);
            // pages collection is treated as if it was at the root level
            // PAGES:
            // const id = meta.dir.replace("pages/", "");
            const id = meta.dir;
            const exclude = this.shouldExcludeFilePath(id);
            if (exclude) {
                continue;
            }
            const matter = extractMatter(path.join(this.root, filepath));
            // ability to filter out contents with conventional frontmatter flags
            if (matter.data.draft) {
                continue;
            }
            const isCollection = isCollectionPath(path.join(this.root, id));
            const route = extractRoute(meta, matter);
            const entry = {
                ...meta,
                ...matter,
                ...route,
            };
            const entrySlugs = this.getSlugsForPath(id);
            entry.slug = entrySlugs[entry.locale].replace(/\//g, "");
            // entry.slug = entrySlugs[entry.locale].replace("/", "");
            if (id) {
                ids[id] = true;
                slugs[id] = entrySlugs;
                entries[id] = entries[id] || {};
                entries[id][entry.locale] = entry;
                if (isCollection) {
                    collections[id] = true;
                }
            }
        }
        // Pass 2: loop through each entry path and construct the output maps
        for (const _id in ids) {
            const id = _id;
            const idParts = id
                .split("/")
                // PAGES:
                .filter((part, idx) => {
                return idx === 0 && part === "pages" ? false : true;
            });
            const locales = slugs[id];
            // if it's a one level path we do not need to do anything more
            if (idParts.length <= 1) {
                routes[id] = locales;
                urls[id] = locales;
                for (const _locale in locales) {
                    const locale = _locale;
                    if (entries[id][locale])
                        entries[id][locale].url = locales[locale];
                }
            }
            else {
                // otherwise we need to loop through each portion of the route and pick
                // each segment's translation from the previously constructed map
                for (const _locale in locales) {
                    const locale = _locale;
                    let pathTarget = "";
                    let url = "";
                    // loop through each part of the route key (e.g. /spaces/outdoor/seasons)
                    // and translate each segment
                    for (let j = 0; j < idParts.length; j++) {
                        pathTarget =
                            `${pathTarget ? pathTarget + "/" : ""}${idParts[j]}`;
                        // use the path part as fallback, which means that if a folder does
                        // not have an entry we use its folder name as part of its children's
                        // url pathnames
                        const folderBasedSlugSegment = `/${idParts[j]}`;
                        const existingSlugSegment = slugs[pathTarget]?.[locale];
                        const slugSegment = typeof existingSlugSegment === "string"
                            ? existingSlugSegment
                            : folderBasedSlugSegment;
                        if (typeof existingSlugSegment !== "string") {
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
                    if (collections[id]) {
                        routes[id] = routes[id] || {};
                        routes[id][locale] = url;
                    }
                    urls[id] = urls[id] || {};
                    urls[id][locale] = url;
                    if (entries[id][locale])
                        entries[id][locale].url = url;
                }
            }
        }
        const promises = [];
        for (const _id in entries) {
            const id = _id;
            const locales = entries[id];
            for (const _locale in locales) {
                const locale = _locale;
                let entry = locales[locale];
                entry = treatAllLinks(entry, this.api, this.urls);
                promises.push(treatAllImages(entry, this.api, this.transformBodyImage));
            }
        }
        const promisesEntries = await Promise.all(promises);
        promisesEntries.forEach((entry) => {
            entries[entry.id][entry.locale] = entry;
        });
        return { routes, urls, slugs, collections, entries };
    }
    /** @private */
    getSlugsForPath(path$1) {
        const pathSlugs = {};
        for (let i = 0; i < this.i18n.locales.length; i++) {
            const locale = this.i18n.locales[i];
            // Should we check `mdx` too? I don't think so...
            const filename = `index.${locale}.md`;
            const pageEntry = path.join(this.root, 
            // PAGES:
            // path === "pages" ? `${path}` : `pages/${path}`,
            path$1, filename);
            let existingEntry = "";
            let slug;
            // first check if we have a specific page entry for this path in
            // `pages` folder
            if (fsExtra.existsSync(pageEntry)) {
                existingEntry = pageEntry;
            }
            else {
                // otherwise check if we have a specific page entry for this path in
                // its `{path}` collection folder
                const collectionEntry = path.join(this.root, path$1, filename);
                if (fsExtra.existsSync(collectionEntry)) {
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
            if (typeof slug !== "string") {
                // special case for homepage, if no slug is specified in the markdown
                // file (probably it should never be) we just hardcode the empty path
                // PAGES:HOME:
                if (path$1 === "pages/home") {
                    slug = "";
                }
                else {
                    const pathParts = path$1.split("/");
                    slug = pathParts[pathParts.length - 1];
                }
            }
            // PAGES:
            (slug = slug.startsWith("pages/") ? slug.replace("pages/", "") : slug),
                (pathSlugs[locale] = ("/" + core.normalisePathname(slug)));
        }
        return pathSlugs;
    }
    /**
     * We want to be quick here, just using a regex is fine for now avoiding
     * `frontmatter` parsing at this phase of the serialization
     *
     * The `slug` regex allows the slug to be defined on the next line in the
     * frontmatter data
     *
     * @private
     */
    getSlugFromRawMdFile(filepath) {
        const content = fsExtra.readFileSync(filepath, "utf-8");
        // check first if slug is defined, it might be defined but empty, hence
        // the following regex would not work
        if (/^slug:/m.test(content)) {
            const regex = /slug:[\s\n]+((?!.+:).+)$/m;
            const matches = content.match(regex);
            if (matches && matches[1]) {
                // use the last bit only of the pathname, declaring a composed path is not
                // allowed as each entry should just define its slug and not its ancestor's
                // ones (which are inferred in the serialization phase).
                const matchParts = matches[1].split("/");
                const slug = matchParts[matchParts.length - 1];
                // replace the quotes if the string is wrapped in it
                return slug.replace(/"|'/g, "");
            }
            // if it is defined but empty we assume the slug is the one for the
            // homepage
            return "";
        }
        return undefined;
    }
    /** @private */
    getRawFile(filepath) {
        try {
            return fsExtra.readFileSync(path.join(this.root, filepath), "utf8");
        }
        catch (e) {
            if (this.debug) {
                console.warn(`kjam/serializer::getRawFile failed to read ${filepath}`, e);
            }
            return null;
        }
    }
    async transformBodyImage(markdownImg) {
        const img = new Img(markdownImg);
        return await img.toComponent();
    }
}

exports.Img = Img;
exports.Serializer = Serializer;
