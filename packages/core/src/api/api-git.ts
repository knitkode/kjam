import { resolve } from "path";
import { readFileSync } from "fs";
import type {
  EntriesMap,
  EntriesMapByRoute,
  EntriesMapByTemplateSlug,
} from "../types";
import { Api, ApiConfig } from "./api";
import { encodePathname } from "../helpers";

export type ApiGitConfig = ApiConfig & {
  username?: string;
  repo?: string;
  branch?: string;
};

export class ApiGit extends Api {
  username: string;
  repo: string;
  branch: string;

  constructor(config?: ApiGitConfig) {
    super();

    this.domain = "raw.githubusercontent.com";

    const { username, repo, branch } = this.getConfig();
    this.username = config?.username || username;
    this.repo = config?.repo || repo;
    this.branch = config?.branch || branch;
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
    const baseUrl = `https://${this.domain}/${username}/${repo}/${branch}`;

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
      try {
        return readFileSync(filepath, { encoding: "utf-8" });
      } catch (_e) {
        return "";
      }
    }

    const url = `${this.getUrl(path)}`;

    try {
      const res = await fetch(url);
      const raw = await res.text();
      return raw;
    } catch (_e) {
      return "";
    }
  }

  /**
   * Get and parse json file produced by `kjam-action` on remote git repo
   */
  async getData<T, F = null>(
    path: string,
    failedReturn: F = null as unknown as F
  ) {
    const raw = await this.getRaw(`.kjam/${path}.json`);
    try {
      return JSON.parse(raw) as T;
    } catch (_e) {
      if (this.debug) {
        console.error(`kjam/core/ApiGit::getData failed parsing '${path}'`);
      }
      return failedReturn;
    }
  }

  async getMaps<T>() {
    const byRoute = (await this.getData("byRoute")) as EntriesMapByRoute<T>;
    const byTemplateSlug = (await this.getData(
      "byTemplateSlug"
    )) as EntriesMapByTemplateSlug<T>;

    const entriesMap = {
      byRoute,
      byTemplateSlug,
    } as EntriesMap<T>;

    return entriesMap;
  }
}
