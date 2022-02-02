import { join } from "path";
import type { Entry } from "../types";
import { Api } from "../api/api";
import { ApiGithub, ApiGithubConfig } from "../api/api-github";
import { Img } from "../img";
import { BaseConfig } from "..";
import { normalisePathname } from "../helpers";

export type ContentConfig = BaseConfig & {
  api?: ApiGithubConfig;
};

export class Content {
  api: Api;
  debug?: boolean;

  constructor(config: ContentConfig = {}) {
    this.debug = !!config?.debug || process.env["KJAM_DEBUG"] === "true";
    this.api = new ApiGithub(config.api);
  }

  async getByRoute<T>(routeId: string, locale?: string) {
    const { byRoute } = await this.api.getMaps<T>();

    if (locale && byRoute[routeId]?.[locale]) {
      return byRoute[routeId]?.[locale];
    }

    return null;
  }

  async get<T>(
    slug: string | string[],
    locale: string
  ): Promise<Entry<T> | null>;
  async get<T>(
    folderPath: string,
    slug: string | string[],
    locale?: string
  ): Promise<Entry<T> | null>;
  async get<T>(
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

    let templateSlug = Array.isArray(_slug) ? _slug.join("/") : _slug;
    // templateSlug = normalisePathname(`${localisedFolderPath}/${_slug}`);
    templateSlug = normalisePathname(`${_folder}/${_slug}`);

    // homepage special case
    if (templateSlug === "home") {
      templateSlug = "";
    }
    if (this.debug) {
      console.log(`kjam/content::get templateSlug: ${templateSlug}`);
    }

    const data = await this.api.getData<Entry<T>>(
      `entries/${templateSlug}__${_locale}`
    );
    return data;
  }

  async treatBody<T>(entry: Pick<Entry<T>, "dir" | "body">) {
    const body = await this.treatBodyImages(entry);

    return body;
  }

  /**
   * Get entry's `body` managing images
   */
  async treatBodyImages<T>(entry: Pick<Entry<T>, "dir" | "body">) {
    const { body } = entry;
    const baseUrl = this.api.getUrl(entry.dir);
    const regex = /!\[.+\]\(.+\)/gm;
    const matches = body.match(regex);
    let output = body;

    // FIXME: disabled for fs problem in middleware
    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const img = new Img(match, baseUrl);
        const replacement = await img.toComponent();
        output = body.replace(match, replacement);
      }
    }

    return output;
  }

  /**
   * Get entry managing images in `data`
   */
  async treatDataImages<T>(entry: any) {
    for (const key in entry.data) {
      if (key !== "body") {
        this.processDataSlice(entry.data, key, entry.dir);
      }
    }

    return entry as Entry<T>;
  }

  /**
   * Get entry managing all images both in` body` and `data`
   */
  async treatAllImages<T>(entry: any) {
    entry = await this.treatDataImages(entry);
    entry.body = await this.treatBodyImages(entry);

    return entry as Entry<T>;
  }

  private processDataSlice(data: any, key: any, baseDir: string) {
    if (typeof data[key] === "string") {
      const currentValue = data[key];
      if (
        currentValue.endsWith(".jpg") ||
        currentValue.endsWith(".jpeg") ||
        currentValue.endsWith(".png")
      ) {
        data[key] = this.api.getUrl(join(baseDir, currentValue));
        // console.log("transformed: ", data[key]);
      }
    } else if (Array.isArray(data[key])) {
      // console.log("is array", key);
      for (let i = 0; i < data[key].length; i++) {
        this.processDataSlice(data[key], i, baseDir);
      }
    } else if (
      Object.prototype.toString.call(data[key]).slice(8, -1) === "Object"
    ) {
      // console.log("is object", key);
      for (const subkey in data[key]) {
        this.processDataSlice(data[key], subkey, baseDir);
      }
    }
  }
}
