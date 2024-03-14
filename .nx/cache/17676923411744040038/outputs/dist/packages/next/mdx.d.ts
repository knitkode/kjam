/**
 * @file
 *
 * Shamelessly copied from [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote/tree/main/src)
 *
 * Probably migrate to `mdx-bundler` once [this PR](https://github.com/kentcdodds/mdx-bundler/issues/137) gets merged
 */
import type { CompileOptions } from "@mdx-js/mdx";
export interface SerializeOptions {
    /**
     * Pass-through variables for use in the MDX content
     */
    scope?: Record<string, unknown>;
    /**
     * These options are passed to the MDX compiler.
     * See [the MDX docs.](https://github.com/mdx-js/mdx/blob/master/packages/mdx/index.js).
     */
    mdxOptions?: Omit<CompileOptions, "outputFormat" | "providerImportSource">;
    /**
     * Indicate whether or not frontmatter should be parsed out of the MDX. Defaults to false
     */
    parseFrontmatter?: boolean;
}
/**
 * Represents the return value of a call to serialize()
 */
export type MDXSerializeResult<TScope = Record<string, unknown>> = {
    /**
     * The compiledSource, generated from next-mdx-remote/serialize
     */
    compiledSource: string;
    /**
     * An arbitrary object of data which will be supplied to the MDX.
     *
     * For example, in cases where you want to provide template variables to the MDX, like `my name is {name}`,
     * you could provide scope as `{ name: "Some name" }`.
     */
    scope?: TScope;
    /**
     * If parseFrontmatter was set to true, contains any parsed frontmatter found in the MDX source.
     */
    frontmatter?: Record<string, string>;
};
/**
 * Prints a nicely formatted error message from an error caught during MDX compilation.
 *
 * @param error - Error caught from the mdx compiler
 * @param source - Raw MDX string
 * @returns Error
 */
export declare function createFormattedMDXError(error: any, source: string): Error;
/**
 * Parses and compiles the provided MDX string. Returns a result which can be passed into <MDXRemote /> to be rendered.
 */
export declare function serialize(
/** Raw MDX contents as a string. */
source: string, { scope, mdxOptions, parseFrontmatter, }?: SerializeOptions): Promise<MDXSerializeResult>;
