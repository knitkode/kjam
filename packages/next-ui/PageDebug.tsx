// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import type { MDXProps } from "./MDX";
import { MDX } from "./MDX";
import type { KjamProps } from "@kjam/next";

export type PageDebugProps = React.PropsWithChildren<
  Partial<KjamProps<{ title?: string; name?: string }, {}>> & {
    tpl?: string;
    mdComponents?: MDXProps["components"];
  }
>;

export const PageDebug = ({
  mdx,
  entry,
  mdComponents = {},
  tpl = "",
  children,
}: PageDebugProps) => {
  return (
    <>
      <table className="kjam-PageDebug">
        <tbody>
          <tr>
            <th>template</th>
            <td>{tpl}</td>
          </tr>
          {entry && (
            <tr>
              <th>slug</th>
              <td>{entry.slug}</td>
            </tr>
          )}
          {entry && entry?.data && (
            <tr>
              <th>entry.data.title</th>
              <td>{entry.data?.title || entry.data?.name || ""}</td>
            </tr>
          )}
          {mdx && (
            <tr>
              <th>mdx</th>
              <td>
                <MDX {...mdx} components={mdComponents} />
              </td>
            </tr>
          )}
          <tr>
            <th>entry JSON</th>
            <td>
              <pre>{JSON.stringify(entry, null, 2)}</pre>
            </td>
          </tr>
          {children && (
            <tr>
              <th>children</th>
              <td>{children}</td>
            </tr>
          )}
        </tbody>
      </table>
      <style>
        {`
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
        `}
      </style>
    </>
  );
};
