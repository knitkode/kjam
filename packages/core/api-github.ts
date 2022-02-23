import { ApiGit, ApiGitConfig } from "./api-git.js";

export type ApiGithubConfig = ApiGitConfig & {};

export class ApiGithub extends ApiGit {
  constructor(config?: ApiGitConfig) {
    super({ domain: "raw.githubusercontent.com", ...config });
  }
}
