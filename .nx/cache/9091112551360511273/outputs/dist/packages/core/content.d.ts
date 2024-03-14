import type { Entry, Kjam } from "./types";
import type { BaseConfig } from "./config-types";
import { Api } from "./api";
import { type ApiGithubConfig } from "./api-github";
export type ContentConfig = BaseConfig & {
    debug?: boolean;
    api?: ApiGithubConfig;
};
export declare class Content {
    api: Api;
    debug?: boolean;
    constructor(config?: ContentConfig);
    getById<T extends {} = {}>(id: string, locale?: string): Promise<Entry<T> | null>;
    get<T extends {} = {}>(slug: string | string[], locale: string): Promise<Entry<T> | null>;
    get<T extends {} = {}>(folderPath: string, slug: string | string[], locale?: string): Promise<Entry<T> | null>;
    getMany<EntryData extends {} = {}>(idStartingWith: string, locale: string, withBody?: boolean): Promise<({
        data: import("./types").EntryMatterData<EntryData>;
        excerpt?: string | undefined;
        id: string;
        templateSlug: string;
        slug: string;
        url: string;
        dir: string;
        locale: Kjam.Locale;
    } | {
        data: import("./types").EntryMatterData<EntryData>;
        excerpt?: string | undefined;
        id: string;
        templateSlug: string;
        slug: string;
        url: string;
        dir: string;
        locale: Kjam.Locale;
        body: string;
    })[]>;
}
