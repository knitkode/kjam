/**
 * @file
 *
 * Shamelessly copied from [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote/blob/main/src/index.tsx)
 * We do this because of esm vs commonjs import problems
 */
import "./idle-callback-polyfill";
import React from "react";
import * as runtime from "react/jsx-runtime";
import * as mdx from "@mdx-js/react";
import type { MDXSerializeResult as _MDXSerializeResult } from "@kjam/next";
type RequestIdleCallbackHandle = number;
type RequestIdleCallbackOptions = {
    timeout?: number;
};
type RequestIdleCallbackDeadline = {
    readonly didTimeout: boolean;
    timeRemaining: () => number;
};
declare global {
    interface Window {
        requestIdleCallback: (callback: (deadline: RequestIdleCallbackDeadline) => void, opts?: RequestIdleCallbackOptions) => RequestIdleCallbackHandle;
        cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
    }
}
export type MDXProps = MDXSerializeResult & {
    /**
     * A object mapping names to React components.
     * The key used will be the name accessible to MDX.
     *
     * For example: `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName/>`.
     */
    components?: React.ComponentProps<typeof mdx.MDXProvider>["components"];
    /**
     * Determines whether or not the content should be hydrated asynchronously, or "lazily"
     */
    lazy?: boolean;
};
export type MDXSerializeResult = _MDXSerializeResult;
/**
 * Renders compiled source from next-mdx-remote/serialize.
 */
export declare function MDX({ compiledSource, frontmatter, scope, components, lazy, }: MDXProps): runtime.JSX.Element;
export {};
