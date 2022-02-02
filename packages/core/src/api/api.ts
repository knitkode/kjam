import { BaseConfig } from "..";
import type { EntriesMap } from "../types";

export type ApiConfig = BaseConfig & {
  domain?: string;
};

export abstract class Api {
  debug?: boolean;

  /**
   * The domain of the API, without `https://` protocol
   */
  domain: string;

  constructor(config: ApiConfig = {}) {
    this.debug = !!config?.debug;
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

  abstract getMaps<T>(): Promise<EntriesMap<T>>;
}