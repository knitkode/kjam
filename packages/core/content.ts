import type { Entry } from "./types";
import type { BaseConfig } from "./config-types";
import { Api } from "./api.js";
import { ApiGithub, ApiGithubConfig } from "./api-github.js";
import { normalisePathname } from "./helpers.js";

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

  async get<T extends {} = {}>(
    slug: string | string[],
    locale: string
  ): Promise<Entry<T> | null>;
  async get<T extends {} = {}>(
    folderPath: string,
    slug: string | string[],
    locale?: string
  ): Promise<Entry<T> | null>;
  async get<T extends {} = {}>(
    ...args:
      | []
      | [slug: string | string[], locale: string]
      | [folderPath: string, slug: string | string[], locale?: string]
  ) {
    let _folder = "";
    let _slug;
    let _locale;
    if (args.length === 2) {
      const [slug, locale] = args;
      _folder;
      _slug = slug;
      _locale = locale;
    } else {
      const [folderPath, slug, locale] = args;
      _folder = folderPath === "pages" ? "" : folderPath || "";
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
      console.log(`[@kjam/core] Content::get target ${target}`);
    }

    const data = await this.api.getData<Entry<T>>(
      `entries/${target}__${_locale}`
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
