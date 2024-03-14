import type { BaseConfig } from "./config-types";
import type { EntriesMap } from "./types";

export type ApiConfig = BaseConfig & {
  /**
   * A full URL to bypass the `username/repo/branch` URL construction.
   * This configuration is mainly thought to be used by the `@kjam/cli` watch
   * to serve local images from localhost URLs.
   */
  url?: string;
  domain?: string;
};

export abstract class Api {
  debug?: boolean;

  url: string;

  /**
   * The domain of the API, without `https://` protocol
   */
  domain: string;

  constructor(config: ApiConfig = {}) {
    this.debug = !!config?.debug;
    this.url = config?.url || "";
    this.domain = config?.domain || "";
  }

  /**
   * Get raw file as text from API
   */
  abstract getRaw(path: string): Promise<string>;

  /**
   * Get JSON data from relative URL path of API,
   *  typical endpoint like behaviour.
   *
   * Usage:
   * ```ts
   * const data = await api.getData(`i18n/${locale}/_.json`)
   * ```
   */
  abstract getData<T, F = null>(path: string, failedReturn?: F): Promise<T | F>;

  /**
   * Return the full base URL of the API
   */
  abstract getUrl(path?: string): string;

  abstract getMaps<T extends {} = {}>(): Promise<EntriesMap<T>>;
}
