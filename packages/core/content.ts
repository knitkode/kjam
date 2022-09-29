import type { Entry } from "./types";
import type { BaseConfig } from "./config-types";
import { Api } from "./api";
import { ApiGithub, ApiGithubConfig } from "./api-github";
import { normalisePathname } from "./helpers";

export type ContentConfig = BaseConfig & {
  debug?: boolean;
  api?: ApiGithubConfig;
};

export class Content {
  api: Api;
  debug?: boolean;

  constructor(config: ContentConfig = {}) {
    this.debug = !!config?.debug || process.env["KJAM_DEBUG"] === "true";
    this.api = new ApiGithub(config.api);
  }

  async getById<T extends {} = {}>(id: string, locale?: string) {
    const { byRoute } = await this.api.getMaps<T>();

    if (locale && byRoute[id]?.[locale]) {
      return byRoute[id]?.[locale];
    }

    return null;
  }

  async getBySlug<T extends {} = {}>(
    slug: string,
  ): Promise<Entry<T> | null> {
    if (this.debug) {
      console.log(`[@kjam/core:content] get slug ${slug}`);
    }

    const data = await this.api.getData<Entry<T>>(
      `urls/${slug}`
    );

    return data;
  }

  async getMany<EntryData extends {} = {}>(
    idStartingWith: string,
    locale: string
  ) {
    const { byRoute } = await this.api.getMaps<EntryData>();

    return Object.keys(byRoute)
      .filter((id) => {
        // add the ending slash so that we match not the folder index page, e.g.
        // with argument "projects" we need to match here not "project/index.en.md"
        // but the entries like "projects/a-title/..."
        return (
          id.startsWith(normalisePathname(idStartingWith) + "/") &&
          !!byRoute[id]?.[locale]
        );
      })
      .map((id) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { body, ...entry } = byRoute[id][locale];
        return entry;
      });
  }
}
