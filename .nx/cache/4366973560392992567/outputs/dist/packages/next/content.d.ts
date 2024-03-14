import "dotenv/config";
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from "next";
import { type Entry, Content, type ContentConfig } from "@kjam/core";
import type { KjamProps } from "./index";
type StaticPathsParams = {
    slug: string | string[];
};
type StaticPathsType = true | false;
export type ContentNextConfig = ContentConfig & {};
export declare class ContentNext extends Content {
    /**
     * @param context We grab the `locales` from this
     * @param fallback Defaults to `"blocking"`
     * @param routeType Defaults to `""`
     * @param asString Defaults to `false`
     * @returns
     */
    getStaticPaths<Params extends StaticPathsParams = StaticPathsParams, Type extends StaticPathsType = boolean>(context: GetStaticPathsContext, fallback?: GetStaticPathsResult["fallback"], routeType?: string, asString?: Type): Promise<GetStaticPathsResult<Params>>;
    getStaticProps<Params extends StaticPathsParams = StaticPathsParams, Data extends {} = {}>(ctx: GetStaticPropsContext<Params>, routeType?: string, otherProps?: {}, options?: Omit<GetStaticPropsResult<Params>, "props">): Promise<GetStaticPropsResult<KjamProps<Data, Params>>>;
    getEntryMdx<T extends {} = {}>(entry: Entry<T>): Promise<import("./mdx").MDXSerializeResult<Record<string, unknown>>>;
}
/**
 * This allows to instantiate the Content class with custom options
 */
export declare const Kjam: (config?: ContentNextConfig) => ContentNext;
/**
 * This provides a default Content class configuration instance
 */
export declare const kjam: ContentNext;
export {};
