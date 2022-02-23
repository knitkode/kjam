// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import type { FC } from "react";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";

export type MDXProps = MDXRemoteProps & {};

export const MDX: FC<MDXProps> = (props) => {
  return <MDXRemote {...props} />;
};
