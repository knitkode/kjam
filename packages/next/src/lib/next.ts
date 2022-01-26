import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { Entry } from "@kjam/core";

export type KjamProps<Data, Params> = {
  mdx: MDXRemoteSerializeResult;
  entry: Entry<Data>;
  params?: Params;
};

export type KjamEntry<T> = Entry<T>;

export * from "./config-next";
export * from "./content-next";
export * from "./translate";
