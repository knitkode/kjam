import "dotenv/config";
type WatchOptions = {
    root?: string;
};
/**
 * @see https://github.com/paulmillr/chokidar
 */
export declare function watch(opts?: WatchOptions): Promise<void>;
export {};
