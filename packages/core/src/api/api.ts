import type { EntriesMap } from "../types"

export abstract class Api {
  
  /**
   * The domain of the API, without `https://` protocol
   */
  domain: string;

  /**
   * The full URL of the API
   */
  url: string;

  constructor() {
    this.domain = "";
    this.url = this.getUrl();
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
  abstract getData<T>(path: string): Promise<T | null>;

  /**
   * Return the full base URL of the API
   */
  abstract getUrl<T>(path?: string): string;

  abstract getMaps<T>(): Promise<EntriesMap<T>>;
}
