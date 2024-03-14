import { ApiGit, type ApiGitConfig } from "./api-git";
export type ApiGithubConfig = ApiGitConfig & {};
export declare class ApiGithub extends ApiGit {
    constructor(config?: ApiGitConfig);
}
