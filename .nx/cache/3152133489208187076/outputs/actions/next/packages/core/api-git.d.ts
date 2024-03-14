import type { EntriesMap } from "./types";
import { Api, type ApiConfig } from "./api";
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
export declare class ApiGit extends Api {
    folder?: string;
    username: string;
    repo: string;
    branch: string;
    constructor(config?: ApiGitConfig);
    /**
     * Get git config from mandatory .env variable
     */
    getConfig(): {
        username: string;
        repo: string;
        branch: string;
    };
    /**
     * The GitHub api url is:
     *
     * `https://api.github.com/repos/${username}/${repo}/${branch}`
     */
    getUrl(path?: string): string;
    getRaw(path: string): Promise<string>;
    /**
     * Get and parse json file produced by `kjam-action` on remote git repo
     */
    getData<T, F = null>(path: string, failedReturn?: F): Promise<T | F>;
    getMaps<T extends {} = {}>(): Promise<EntriesMap<T>>;
}
