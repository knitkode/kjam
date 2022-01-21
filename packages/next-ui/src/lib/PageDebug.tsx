// @ts-ignore eslint-disable-next-line no-unused-vars
import React from "react";
import type { FC, ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote";
import type { KjamProps } from "@kjam/next";

export type PageDebugProps = Partial<
  KjamProps<{ title?: string; name?: string }, {}>
> & {
  tpl?: string;
  mdComponents?: Record<string, ReactNode>;
};

export const PageDebug: FC<PageDebugProps> = ({
  mdx,
  entry,
  mdComponents = {},
  tpl = "",
  children,
}) => {
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
          {entry && (
            <tr>
              <th>entry.data.title</th>
              <td>{entry.data?.title || entry.data?.name || ""}</td>
            </tr>
          )}
          {mdx && (
            <tr>
              <th>mdx</th>
              <td>
                <MDXRemote {...mdx} components={mdComponents} />
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
            table-layout: fixed;
            width: 100%;
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
