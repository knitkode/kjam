import { type Kjam, type EntriesMapById, type ApiGithubConfig, Api } from "@kjam/core";
type LoggerType = "info" | "error" | "warn";
type Logger = (data: any, type?: LoggerType) => void;
export type SerializerBodyImgTransformer = (markdownImg: string) => Promise<string>;
export type SerializerConfig<T> = T & {
    api?: ApiGithubConfig;
    debug?: boolean;
    root?: string;
    /** @default "settings/i18n/config.yml" */
    pathI18n?: string;
    /** @default "settings/i18n/messages" */
    pathTranslations?: string;
    log?: Logger;
};
export declare class Serializer<T = Record<string, unknown>> {
    api: Api;
    config: T;
    /** Logger function */
    log: Logger;
    /** Flag for debug mode */
    readonly debug: boolean;
    /** Path where the i18n config YAML file is placed */
    readonly pathI18n: string;
    /** Path of the folder where the i18n YAML translations files are placed */
    readonly pathTranslations: string;
    /** Repository root absolute folder path */
    readonly root: string;
    i18n: Kjam.I18n;
    routes: Kjam.Routes;
    urls: Kjam.Urls;
    slugs: Kjam.Slugs;
    translations: Kjam.Translations;
    collections: Record<Kjam.RouteId, true>;
    entries: EntriesMapById;
    /**
     * All markdown files paths
     */
    mdPaths: string[];
    constructor(config?: SerializerConfig<T>);
    run(): Promise<{
        byRoute: EntriesMapById;
    }>;
    /**
     * Use this in subclasses as we are sure that routes structure has been
     * calculated
     *
     * @abstract
     */
    start(): Promise<any>;
    /**
     * Get all files' path recursively
     */
    getPaths(dir?: string): Promise<string[]>;
    /** @protected */
    getMarkdownPaths(): Promise<string[]>;
    /**
     * Make sure that the meta folder is there, always remove it and recreate it
     */
    private ensureMetaFolder;
    protected writeFile(filepath: string | undefined, data: any): void;
    /** @protected */
    getI18n(): Kjam.I18n;
    shouldExcludeFilePath(dirAsId: string): boolean;
    /**
     * Let's do everyhting in this big function. We can avoid creating too many maps
     * to pass around to other functions. It might be hard to read but let's
     * comment it properly.
     *
     * The convention is that each markdown file is in its own folder alongside
     * its translations, e.g. we could have:
     *
     * ```
     * projects/wood/boxes/index.en.md
     * projects/wood/boxes/index.it.md
     * ```
     *
     * What we are interested in here is just the `projects/wood` bit as the
     * `boxes` folder is not the folder in terms of URL as it behaves like the entry
     * `slug`, in other words the last portion of the URL pathname. In fact this
     * content entry will be probably reachable at something like these URLS:
     *
     * ```
     * https://example.com/projects/wood/boxes (en)
     * https://example.com/it/progetti/legno/scatole (it)
     * ```
     *
     * @private
     */
    getRouting(markdownFiles: string[]): Promise<{
        routes: Kjam.Routes;
        urls: Kjam.Urls;
        slugs: Kjam.Slugs;
        collections: Record<string, true>;
        entries: EntriesMapById;
    }>;
    /** @private */
    private getSlugsForPath;
    /**
     * We want to be quick here, just using a regex is fine for now avoiding
     * `frontmatter` parsing at this phase of the serialization
     *
     * The `slug` regex allows the slug to be defined on the next line in the
     * frontmatter data
     *
     * @private
     */
    private getSlugFromRawMdFile;
    /** @private */
    getRawFile(filepath: string): string | null;
    transformBodyImage(markdownImg: string): Promise<string>;
}
export {};
