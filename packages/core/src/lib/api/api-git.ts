import { resolve } from "path";
import { readFileSync } from "fs";
import type {
  EntriesMap,
  EntriesMapByRoute,
  EntriesMapByTemplateSlug,
} from "../types";
import { Api } from "./api";
import { encodePathname } from "../helpers";
// FIXME: fix typescript for Cache class, otherwise it breaks the build
// import { Cache } from "../helpers/cache";

export type ApiGitConfig = {
  username?: string;
  repo?: string;
  branch?: string;
};

export class ApiGit extends Api {
  config: Required<ApiGitConfig>;

  constructor(config?: ApiGitConfig) {
    super();
    
    const { username, repo, branch } = this.getConfig();

    this.domain = "raw.githubusercontent.com";

    this.config = {
      username: config?.username || username,
      repo: config?.repo || repo,
      branch: config?.branch || branch,
    };
    this.url = this.getUrl();
  }

  /**
   * Get git config from mandatory .env variable
   */
  getConfig() {
    const [username, repo, branch] = (process.env["KJAM_GIT"] || "").split("/");

    return {
      username,
      repo,
      branch,
    };
  }

  /**
   * The GitHub api url is:
   * 
   * `https://api.github.com/repos/${username}/${repo}/${branch}`
   */
  getUrl(path?: string) {
    const { username, repo, branch } = this.getConfig();
    let baseUrl = `https://${this.domain}/${username}/${repo}/${branch}`;

    if (path) {
      return `${baseUrl}/${encodePathname(path)}`;
    }

    return baseUrl;
  }

  async getRaw(path: string) {
    const gitFsPath = process.env["KJAM_GIT_FS"] || "";

    if (gitFsPath) {
      // const { readFileSync } = require("fs");
      // const { resolve } = require("path");
      const filepath = resolve(process.cwd(), gitFsPath, encodePathname(path));
      return readFileSync(filepath, { encoding: "utf-8" });
    }

    const url = `${this.getUrl(path)}`;
    const res = await fetch(url);
    const raw = await res.text();
    return raw;
  }

  /**
   * Get and parse json file produced by `kjam-action` on remote git repo
   */
  async getData<T>(path: string) {
    const raw = await this.getRaw(`.kjam/${path}.json`);
    try {
      return JSON.parse(raw) as T;
    } catch (_e) {
      console.error(`kjam/core/ApiGit::getData failed parsing ${path}`);
      return null;
    }
  }

  async getMaps<T>() {
    // const cached = Cache.get<EntriesMap<T>>("content");
    // if (cached) {
    //   return cached;
    // }

    const byRoute = (await this.getData("byRoute")) as EntriesMapByRoute<T>;
    const byTemplateSlug = (await this.getData(
      "byTemplateSlug"
    )) as EntriesMapByTemplateSlug<T>;

    const entriesMap = {
      byRoute,
      byTemplateSlug,
    } as EntriesMap<T>;

    // Cache.set<EntriesMap<T>>("content", entriesMap);

    return entriesMap;
  }
}
