import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { Entry, EntryLean } from "@kjam/core";

export type KjamProps<Data extends {} = {}, Params extends {} = {}> = {
  mdx?: null | MDXRemoteSerializeResult;
  entry: Entry<Data>;
  params?: Params;
};

export type KjamEntry<T extends {} = {}> = Entry<T>;

export type KjamEntryLean<T extends {} = {}> = EntryLean<T>;

export type { ContentNextConfig } from "./content";
export { kjam, ContentNext } from "./content";
