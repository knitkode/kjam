import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { Entry, EntryLean } from "@kjam/core";

export type KjamProps<Data, Params> = {
  mdx?: null | MDXRemoteSerializeResult;
  entry: Entry<Data>;
  params?: Params;
};

export type KjamEntry<T> = Entry<T>;

export type KjamEntryLean<T> = EntryLean<T>;

export * from "./content";
