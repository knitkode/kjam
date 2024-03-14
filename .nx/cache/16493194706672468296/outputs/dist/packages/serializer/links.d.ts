import type { Api, Kjam } from "@kjam/core";
/**
 * Get entry managing all links both in` body` and `data`
 */
export declare function treatAllLinks<T>(entry: any, api: Api, urls: Kjam.Urls): Entry<T>;
