import React from "react";
import type { MDXProps } from "./MDX";
import type { KjamProps } from "@kjam/next";
export type PageDebugProps = React.PropsWithChildren<Partial<KjamProps<{
    title?: string;
    name?: string;
}, {}>> & {
    tpl?: string;
    mdComponents?: MDXProps["components"];
}>;
export declare const PageDebug: ({ mdx, entry, mdComponents, tpl, children, }: PageDebugProps) => import("react/jsx-runtime").JSX.Element;
