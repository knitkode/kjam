/**
 * @file
 *
 * Shamelessly copied from [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote/tree/main/src)
 *
 * Probably migrate to `mdx-bundler` once [this PR](https://github.com/kentcdodds/mdx-bundler/issues/137) gets merged
 */
import type { CompileOptions } from "@mdx-js/mdx";
import type { Plugin } from "unified";
import { codeFrameColumns } from "@babel/code-frame";

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
 * Attempt to parse position information from an error message originating from the MDX compiler.
 * Only used if the error object doesn't contain
 */
function parsePositionInformationFromErrorMessage(
  message: string
): { start: { line: number; column: number } } | undefined {
  const positionInfoPattern = /\d+:\d+(-\d+:\d+)/g;

  const match = message.match(positionInfoPattern);

  if (match) {
    // take the last match, that seems to be the most reliable source of the error.
    const lastMatch = match.slice(-1)[0];

    const [line, column] = lastMatch.split("-")[0].split(":");

    return {
      start: {
        line: Number.parseInt(line, 10),
        column: Number.parseInt(column, 10),
      },
    };
  }

  return;
}

/**
 * Prints a nicely formatted error message from an error caught during MDX compilation.
 *
 * @param error - Error caught from the mdx compiler
 * @param source - Raw MDX string
 * @returns Error
 */
export function createFormattedMDXError(error: any, source: string) {
  const position =
    error?.position ?? parsePositionInformationFromErrorMessage(error?.message);

  const codeFrames = position
    ? codeFrameColumns(
        source,
        {
          start: {
            line: position.start.line,
            column: position.start.column ?? 0,
          },
        },
        { linesAbove: 2, linesBelow: 2 }
      )
    : "";

  const formattedError = new Error(`[next-mdx-remote] error compiling MDX:
${error?.message}
${codeFrames ? "\n" + codeFrames + "\n" : ""}
More information: https://mdxjs.com/docs/troubleshooting-mdx`);

  formattedError.stack = "";

  return formattedError;
}

/**
 * remark plugin which removes all import and export statements
 */
function removeImportsExportsPlugin(
  remove: typeof import("unist-util-remove").remove
): Plugin {
  return (tree) => remove(tree, "mdxjsEsm");
}

function getCompileOptions(
  mdxOptions: SerializeOptions["mdxOptions"] = {},
  remove: typeof import("unist-util-remove").remove
): CompileOptions {
  const areImportsEnabled = mdxOptions?.useDynamicImport;

  // don't modify the original object when adding our own plugin
  // this allows code to reuse the same options object
  const remarkPlugins = [
    ...(mdxOptions.remarkPlugins || []),
    ...(areImportsEnabled ? [] : [() => removeImportsExportsPlugin(remove)]),
  ];

  return {
    ...mdxOptions,
    remarkPlugins,
    outputFormat: "function-body",
    providerImportSource: "@mdx-js/react",
  };
}

/**
 * Parses and compiles the provided MDX string. Returns a result which can be passed into <MDXRemote /> to be rendered.
 */
export async function serialize(
  /** Raw MDX contents as a string. */
  source: string,
  {
    scope = {},
    mdxOptions = {},
    parseFrontmatter = false,
  }: SerializeOptions = {}
): Promise<MDXSerializeResult> {
  // the following are native ESM, and we're running in a CJS context.
  // This is the only way to import ESM within CJS

  // const [{ VFile }, { matter }, { compile }, { remove }] = await Promise.all([
  //   import("vfile"),
  //   import("vfile-matter"),
  //   import("@mdx-js/mdx"),
  //   import("unist-util-remove")
  // ]);

  // const vfile = new VFile({ value: source });

  // // makes frontmatter available via vfile.data.matter
  // if (parseFrontmatter) {
  //   matter(vfile, { strip: true });
  // }

  // let compiledMdx;

  // try {
  //   compiledMdx = await compile(vfile, getCompileOptions(mdxOptions, remove));
  // } catch (error: any) {
  //   throw createFormattedMDXError(error, String(vfile));
  // }

  // const compiledSource = String(compiledMdx);

  // return {
  //   compiledSource,
  //   frontmatter:
  //     (vfile.data["matter"] as Record<string, string> | undefined) ?? {},
  //   scope,
  // };

  const [/* { read }, { load, JSON_SCHEMA }, */ { compile }, { remove }] =
    await Promise.all([
      // import("gray-matter"),
      // import("js-yaml"),
      // FIXME: hacky workaround, @see https://github.com/microsoft/TypeScript/issues/43329#issuecomment-1008361973
      Function('return import("@mdx-js/mdx")')() as Promise<
        typeof import("@mdx-js/mdx")
      >,
      Function('return import("unist-util-remove")')() as Promise<
        typeof import("unist-util-remove")
      >,
      // import("@mdx-js/mdx"),
      // import("unist-util-remove")
    ]);

  // makes frontmatter available via vfile.data.matter
  if (parseFrontmatter) {
    // const { content, excerpt, data } = read(source, {
    //   excerpt: true,
    //   engines: {
    //     // turn off automatic date parsing
    //     // @see https://github.com/jonschlinkert/gray-matter/issues/62#issuecomment-577628177
    //     // @ts-expect-error I don't think this is important
    //     yaml: (s) => load(s, { schema: JSON_SCHEMA }),
    //   },
    // });
  }

  let compiledMdx;

  try {
    compiledMdx = await compile(source, getCompileOptions(mdxOptions, remove));
  } catch (error: any) {
    throw createFormattedMDXError(error, String(source));
  }

  const compiledSource = String(compiledMdx);

  return {
    compiledSource,
    frontmatter: {},
    scope,
  };
}
