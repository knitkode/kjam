import { join, isAbsolute } from 'path';
import { readFileSync } from 'fs';

class Api {
    debug;
    url;
    /**
     * The domain of the API, without `https://` protocol
     */
    domain;
    constructor(config = {}) {
        this.debug = !!config?.debug;
        this.url = config?.url || "";
        this.domain = config?.domain || "";
    }
}

/**
 * Normalise pathname
 *
 * From a path like `/some//malformed/path///` it returns `some/malformed/path`
 *
 * - Removes subsequent slashes
 * - Removing initial and ending slashes
 */
function normalisePathname(pathname = "") {
    return pathname.replace(/\/+\//g, "/").replace(/^\/*(.*?)\/*$/, "$1");
}
/**
 * Clean a pathname and encode each part
 *
 * @see {@link normalisePathname}
 */
function encodePathname(pathname) {
    const parts = normalisePathname(pathname).split("/");
    return parts
        .filter((part) => !!part)
        .map((part) => encodeURIComponent(part))
        .join("/");
}
/**
 * Detect if we are running a test
 *
 * @see https://stackoverflow.com/q/50940640/9122820
 */
function isTestEnv() {
    return (process.env["JEST_WORKER_ID"] !== undefined ||
        process.env["NODE_ENV"] === "test");
}

class ApiGit extends Api {
    folder;
    username;
    repo;
    branch;
    constructor(config) {
        super(config);
        this.folder = config?.folder || "";
        this.username = config?.username || "";
        this.repo = config?.repo || "";
        this.branch = config?.branch || "";
    }
    /**
     * Get git config from mandatory .env variable
     */
    getConfig() {
        const [username, repo, branch] = (process.env["KJAM_GIT"] || "").split("/");
        return {
            username: username || this.username || "",
            repo: repo || this.repo || "",
            branch: branch || this.branch || "",
        };
    }
    /**
     * The GitHub api url is:
     *
     * `https://api.github.com/repos/${username}/${repo}/${branch}`
     */
    getUrl(path) {
        let baseUrl = this.url;
        if (!baseUrl) {
            const { username, repo, branch } = this.getConfig();
            baseUrl = `https://${this.domain}/${username}/${repo}/${branch}`;
        }
        if (path) {
            return `${baseUrl}/${encodePathname(path)}`;
        }
        return baseUrl;
    }
    async getRaw(path) {
        const gitFolder = process.env["KJAM_FOLDER"] || this.folder;
        if (gitFolder) {
            const filepath = join(isAbsolute(gitFolder) ? "" : process.cwd(), gitFolder, path);
            try {
                return readFileSync(filepath, { encoding: "utf-8" });
            }
            catch (_e) {
                return "";
            }
        }
        const url = `${this.getUrl(path)}`;
        try {
            const res = await fetch(url);
            const raw = await res.text();
            return raw;
        }
        catch (_e) {
            return "";
        }
    }
    /**
     * Get and parse json file produced by `kjam-action` on remote git repo
     */
    async getData(path, failedReturn = null) {
        const raw = await this.getRaw(`.kjam/${path}.json`);
        try {
            return JSON.parse(raw);
        }
        catch (_e) {
            if (this.debug) {
                console.error(`[@kjam/core:ApiGit]:getData failed parsing JSON at '${path}'`);
            }
            return failedReturn;
        }
    }
    async getMaps() {
        const byRoute = (await this.getData("byRoute"));
        const entriesMap = {
            byRoute,
        };
        return entriesMap;
    }
}

class ApiGithub extends ApiGit {
    constructor(config) {
        super({ domain: "raw.githubusercontent.com", ...config });
    }
}

class Content {
    api;
    debug;
    constructor(config = {}) {
        this.debug = !!config?.debug || process.env["KJAM_DEBUG"] === "true";
        this.api = new ApiGithub(config.api);
    }
    async getById(id, locale) {
        const { byRoute } = await this.api.getMaps();
        if (locale && byRoute[id]?.[locale]) {
            return byRoute[id]?.[locale];
        }
        return null;
    }
    async get(...args) {
        let _folder = "";
        let _slug;
        let _locale;
        if (args.length === 2) {
            const [slug, locale] = args;
            _slug = slug;
            _locale = locale;
        }
        else {
            const [folderPath, slug, locale] = args;
            // PAGES:
            // _folder = folderPath === "pages" ? "" : folderPath || "";
            _folder = folderPath || "";
            _slug = slug;
            _locale = locale;
        }
        let target = Array.isArray(_slug) ? _slug.join("/") : _slug;
        // target = normalisePathname(`${localisedFolderPath}/${_slug}`);
        target = normalisePathname(`${_folder}/${_slug}`);
        // homepage special case
        if (target === "home") {
            target = "";
        }
        if (this.debug) {
            console.log(`[@kjam/core:Content]::get target ${target}`);
        }
        const data = await this.api.getData(`entries/${target}__${_locale}`);
        return data;
    }
    async getMany(idStartingWith, locale, withBody) {
        const { byRoute } = await this.api.getMaps();
        return Object.keys(byRoute)
            .filter((id) => {
            // add the ending slash so that we match not the folder index page, e.g.
            // with argument "projects" we need to match here not "project/index.en.md"
            // but the entries like "projects/a-title/..."
            return (id.startsWith(normalisePathname(idStartingWith) + "/") &&
                !!byRoute[id]?.[locale]);
        })
            .map((id) => {
            const { body, ...entry } = byRoute[id][locale];
            return withBody ? { body, ...entry } : entry;
        });
    }
}

export { Api, ApiGit, ApiGithub, Content, encodePathname, isTestEnv, normalisePathname };
