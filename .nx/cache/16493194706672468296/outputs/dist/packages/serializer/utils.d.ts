import type { Kjam, EntryMeta, EntryMatter, EntryRoute } from "@kjam/core";
/**
 * Only keep `.md` and `.mdx` files based on filename
 */
export declare function filterMarkdownFiles(filenameOrPath: string): boolean;
export declare function extractMeta(filepath: string, i18n: Kjam.I18n): EntryMeta;
export declare function extractMatter<T>(filepath: string): EntryMatter<T>;
export declare function extractRoute<T>(meta: EntryMeta, matter: EntryMatter<T>): EntryRoute;
/**
 * Check if the given folder path is a folder containing a collection of entries
 */
export declare function isCollectionPath(fullpath: string): boolean;
export declare function replaceAsync(str: string, regex: RegExp, asyncFn: (...args: any[]) => Promise<string>): Promise<string>;
export declare function parseUrl<T extends Record<string, unknown> = {}>(url?: string): {
    path: string;
    query: string;
    params: T;
    relative: boolean;
    file: boolean;
    ext: string | undefined;
};
