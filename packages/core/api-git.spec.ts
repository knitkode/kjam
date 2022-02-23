import { ApiGit } from "./api-git";

const API_GIT_CONFIG = {
  domain: "example.com",
  username: "username",
  repo: "repo",
  branch: "branch",
};

const api = new ApiGit(API_GIT_CONFIG);

test("getUrl", () => {
  expect(api.getUrl("some/path")).toEqual(
    `https://example.com/username/repo/branch/some/path`
  );
});
