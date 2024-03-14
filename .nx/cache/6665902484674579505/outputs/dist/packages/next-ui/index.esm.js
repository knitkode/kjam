import * as runtime from 'react/jsx-runtime';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import * as mdx from '@mdx-js/react';

/**
 * Renders compiled source from next-mdx-remote/serialize.
 */
function MDX({ compiledSource, frontmatter, scope, components = {}, lazy, }) {
    const [isReadyToRender, setIsReadyToRender] = useState(!lazy || typeof window === "undefined");
    // if we're on the client side and `lazy` is set to true, we hydrate the
    // mdx content inside requestIdleCallback, allowing the page to get to
    // interactive quicker, but the mdx content to hydrate slower.
    useEffect(() => {
        if (lazy) {
            const handle = window.requestIdleCallback(() => {
                setIsReadyToRender(true);
            });
            return () => window.cancelIdleCallback(handle);
        }
        return;
    }, [lazy]);
    const Content = useMemo(() => {
        // if we're ready to render, we can assemble the component tree and let React do its thing
        // first we set up the scope which has to include the mdx custom
        // create element function as well as any components we're using
        const fullScope = Object.assign({ opts: { ...mdx, ...runtime } }, { frontmatter }, scope);
        const keys = Object.keys(fullScope);
        const values = Object.values(fullScope);
        // now we eval the source code using a function constructor
        // in order for this to work we need to have React, the mdx createElement,
        // and all our components in scope for the function, which is the case here
        // we pass the names (via keys) in as the function's args, and execute the
        // function with the actual values.
        const hydrateFn = Reflect.construct(Function, keys.concat(`${compiledSource}`));
        return hydrateFn.apply(hydrateFn, values).default;
    }, [scope, compiledSource, frontmatter]);
    if (!isReadyToRender) {
        // If we're not ready to render, return an empty div to preserve SSR'd markup
        return (jsx("div", { dangerouslySetInnerHTML: { __html: "" }, suppressHydrationWarning: true }));
    }
    // wrapping the content with MDXProvider will allow us to customize the standard
    // markdown components (such as "h1" or "a") with the "components" object
    const content = (jsx(mdx.MDXProvider, { components: components, children: jsx(Content, {}) }));
    // If lazy = true, we need to render a wrapping div to preserve the same markup structure that was SSR'd
    return lazy ? jsx("div", { children: content }) : content;
}

const PageDebug = ({ mdx, entry, mdComponents = {}, tpl = "", children, }) => {
    return (jsxs(Fragment, { children: [jsx("table", { className: "kjam-PageDebug", children: jsxs("tbody", { children: [jsxs("tr", { children: [jsx("th", { children: "template" }), jsx("td", { children: tpl })] }), entry && (jsxs("tr", { children: [jsx("th", { children: "slug" }), jsx("td", { children: entry.slug })] })), entry && entry?.data && (jsxs("tr", { children: [jsx("th", { children: "entry.data.title" }), jsx("td", { children: entry.data?.title || entry.data?.name || "" })] })), mdx && (jsxs("tr", { children: [jsx("th", { children: "mdx" }), jsx("td", { children: jsx(MDX, { ...mdx, components: mdComponents }) })] })), jsxs("tr", { children: [jsx("th", { children: "entry JSON" }), jsx("td", { children: jsx("pre", { children: JSON.stringify(entry, null, 2) }) })] }), children && (jsxs("tr", { children: [jsx("th", { children: "children" }), jsx("td", { children: children })] }))] }) }), jsx("style", { children: `
          body {
            margin: 0;
          }
          
          .kjam-PageDebug {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            font-family: monospace;
          }
          
          .kjam-PageDebug th {
            text-align: right;
            width: 150px;
          }
          
          .kjam-PageDebug th,
          .kjam-PageDebug td {
            padding: 10px;
            border: 1px solid #ccc;
            vertical-align: top;
          }
          
          .kjam-PageDebug pre {
            background: #f4f4f4;
            color: #666;
            page-break-inside: avoid;
            font-size: 12px;
            line-height: 1.6;
            margin: -10px;
            max-width: 100%;
            overflow: auto;
            padding: 1em 1.5em;
            display: block;
            word-wrap: break-word;
          }          
        ` })] }));
};

export { MDX, PageDebug };
