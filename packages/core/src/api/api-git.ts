import { join, isAbsolute } from "path";
import { readFileSync } from "fs";
import type { EntriesMap, EntriesMapByRoute } from "../types";
import { Api, ApiConfig } from "./api";
import { encodePathname } from "../helpers";

export type ApiGitConfig = ApiConfig & {
  /**
   * Optionally point the API to a local folder. This value represent the relative
   * path to the `cwd()` that points to the local repository.
   *
   * This is always overwritten by the .env variable `KJAM_FOLDER` if defined and
   * not empty
   */
  folder?: string;
  /**
   * Git username, used to construct the remote git url
   */
  username?: string;
  /**
   * Git repository name, used to construct the remote git url
   */
  repo?: string;
  /**
   * Git branch name, used to construct the remote git url
   */
  branch?: string;
};

export class ApiGit extends Api {
  folder?: string;
  username: string;
  repo: string;
  branch: string;

  constructor(config?: ApiGitConfig) {
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
  getUrl(path?: string) {
    const { username, repo, branch } = this.getConfig();
    const baseUrl = `https://${this.domain}/${username}/${repo}/${branch}`;

    if (path) {
      return `${baseUrl}/${encodePathname(path)}`;
    }

    return baseUrl;
  }

  async getRaw(path: string) {
    const gitFolder = process.env["KJAM_FOLDER"] || this.folder;

    if (gitFolder) {
      // const { readFileSync } = require("fs");
      // const { join } = require("path");
      const filepath = join(
        isAbsolute(gitFolder) ? "" : process.cwd(),
        gitFolder,
        path
      );
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
        console.error(
          `kjam/core/ApiGit::getData failed parsing JSON at path '${path}'`
        );
      }
      return failedReturn;
    }
  }

  async getMaps<T>() {
    const byRoute = (await this.getData("byRoute")) as EntriesMapByRoute<T>;

    const entriesMap = {
      byRoute,
    } as EntriesMap<T>;

    return entriesMap;
  }
}
