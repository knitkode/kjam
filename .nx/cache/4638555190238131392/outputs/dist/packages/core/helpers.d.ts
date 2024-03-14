/**
 * Normalise pathname
 *
 * From a path like `/some//malformed/path///` it returns `some/malformed/path`
 *
 * - Removes subsequent slashes
 * - Removing initial and ending slashes
 */
export declare function normalisePathname(pathname?: string): string;
/**
 * Clean a pathname and encode each part
 *
 * @see {@link normalisePathname}
 */
export declare function encodePathname(pathname: string): string;
/**
 * Detect if we are running a test
 *
 * @see https://stackoverflow.com/q/50940640/9122820
 */
export declare function isTestEnv(): boolean;
