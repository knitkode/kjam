// import fs from 'node:fs';
import { resolve } from "path";
import { readFile } from "fs/promises";
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

export abstract class ApiGit extends Api {
  // config: Required<ApiGitConfig>;
  // url: string;

  // constructor(config?: ApiGitConfig) {
  //   const [username, repo, branch] = (process.env["KJAM_GIT"] || "").split("/");
  //   this.config = {
  //     username: config?.username || username,
  //     repo: config?.repo || repo,
  //     branch: config?.branch || branch,
  //   };
  //   this.url = d.getUrl();
  // }

  /**
   * Get git config from mandatory .env variable
   */
  static getConfig() {
    const [username, repo, branch] = (process.env["KJAM_GIT"] || "").split("/");

    return {
      username,
      repo,
      branch,
    };
  }

  /**
   * The github api url would be:
   * `https://api.github.com/repos/${username}/${repo}/git/trees/${branch}?recursive=1`
   */
  static getUrl(path?: string) {
    const { username, repo, branch } = this.getConfig();
    let baseUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}`;

    if (path) {
      return `${baseUrl}/${encodePathname(path)}`;
    }

    return baseUrl;
  }

  static async getRaw(path: string) {
    const gitFsPath = process.env["KJAM_GIT_FS"] || "";

    if (gitFsPath) {
      const filepath = resolve(process.cwd(), gitFsPath, encodePathname(path));
      return await readFile(filepath, { encoding: "utf-8" });
    }

    const url = `${this.getUrl(path)}`;
    const res = await fetch(url);
    const raw = await res.text();
    return raw;
  }

  /**
   * Get and parse json file produced by `kjam-action` on remote git repo
   */
  static async getData<T>(path: string) {
    const raw = await this.getRaw(`.kjam/${path}.json`);
    try {
      return JSON.parse(raw) as T;
    } catch (_e) {
      console.error(`kjam/core/ApiGit::getData failed parsing path, ${path}`);
      throw new Error();
    }
  }

  static async getMaps<T>() {
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

    // fs.writeFileSync(
    //   nodePath.join(process.cwd(), 'yes.json'),
    //   JSON.stringify(entriesMap, null, 2),
    //   {
    //     encoding: 'utf-8',
    //   }
    // );

    return entriesMap;
  }
}
