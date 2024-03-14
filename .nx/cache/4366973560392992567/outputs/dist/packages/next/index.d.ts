import type { Entry, EntryLean } from "@kjam/core";
import type { MDXSerializeResult as _MDXSerializeResult } from "./mdx";
export type MDXSerializeResult = _MDXSerializeResult;
export type KjamProps<Data extends {} = {}, Params extends {} = {}> = {
    mdx?: null | MDXSerializeResult;
    entry: Entry<Data>;
    params?: Params;
};
export type KjamEntry<T extends {} = {}> = Entry<T>;
export type KjamEntryLean<T extends {} = {}> = EntryLean<T>;
export type { ContentNextConfig } from "./content";
export { kjam, ContentNext } from "./content";
