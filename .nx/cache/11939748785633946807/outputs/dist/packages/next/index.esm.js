import 'dotenv/config';
import { Content, normalisePathname } from '@kjam/core';
import { codeFrameColumns } from '@babel/code-frame';

/**
 * Attempt to parse position information from an error message originating from the MDX compiler.
 * Only used if the error object doesn't contain
 */
function parsePositionInformationFromErrorMessage(message) {
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
function createFormattedMDXError(error, source) {
    const position = error?.position ?? parsePositionInformationFromErrorMessage(error?.message);
    const codeFrames = position
        ? codeFrameColumns(source, {
            start: {
                line: position.start.line,
                column: position.start.column ?? 0,
            },
        }, { linesAbove: 2, linesBelow: 2 })
        : "";
    const formattedError = new Error(`[next-mdx-remote] error compiling MDX:
${error?.message}
${codeFrames ? "\n" + codeFrames + "\n" : ""}
More information: https://mdxjs.com/docs/troubleshooting-mdx`);
    formattedError.stack = "";
    return formattedError;
}
function getCompileOptions(mdxOptions = {}, remove) {
    // don't modify the original object when adding our own plugin
    // this allows code to reuse the same options object
    const remarkPlugins = [
        ...(mdxOptions.remarkPlugins || []),
        ...([] ),
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
async function serialize(
/** Raw MDX contents as a string. */
source, { scope = {}, mdxOptions = {}, parseFrontmatter = false, } = {}) {
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
    const [/* { read }, { load, JSON_SCHEMA }, */ { compile }, { remove }] = await Promise.all([
        // import("gray-matter"),
        // import("js-yaml"),
        // FIXME: hacky workaround, @see https://github.com/microsoft/TypeScript/issues/43329#issuecomment-1008361973
        Function('return import("@mdx-js/mdx")')(),
        Function('return import("unist-util-remove")')(),
        // import("@mdx-js/mdx"),
        // import("unist-util-remove")
    ]);
    let compiledMdx;
    try {
        compiledMdx = await compile(source, getCompileOptions(mdxOptions, remove));
    }
    catch (error) {
        throw createFormattedMDXError(error, String(source));
    }
    const compiledSource = String(compiledMdx);
    return {
        compiledSource,
        frontmatter: {},
        scope,
    };
}

class ContentNext extends Content {
    /**
     * @param context We grab the `locales` from this
     * @param fallback Defaults to `"blocking"`
     * @param routeType Defaults to `""`
     * @param asString Defaults to `false`
     * @returns
     */
    async getStaticPaths(context, fallback = "blocking", routeType = "", asString) {
        const ctxLocalesMap = context.locales?.reduce((map, locale) => {
            map[locale] = true;
            return map;
        }, {}) ?? {};
        const paths = [];
        const { byRoute } = await this.api.getMaps();
        // the ending slash ensures that we are not gathering the root level `index`
        // entry for the given `routeType` (usually a collection)
        // PAGES:
        // const normalisedRouteType =
        //   normalisePathname(routeType === "pages" ? "" : routeType) + "/";
        const normalisedRouteType = normalisePathname(routeType) + "/";
        for (const [id, locales] of Object.entries(byRoute)) {
            if (id.startsWith(normalisedRouteType)) {
                for (const [locale, entry] of Object.entries(locales)) {
                    const slugSegments = entry.templateSlug
                        .replace(normalisedRouteType, "")
                        .split("/")
                        .filter((segment, idx) => segment && !(idx === 0 && segment === "pages"));
                    let slug;
                    if (ctxLocalesMap[locale]) {
                        if (asString) {
                            if (slugSegments.length === 1) {
                                slug = entry.slug;
                            }
                        }
                        else {
                            slug = slugSegments;
                        }
                        // ensure that slug is not empty array or empty string, next.js does
                        // not want that
                        if ((typeof slug === "string" && slug) ||
                            (Array.isArray(slug) && slug.length)) {
                            paths.push({
                                // @ts-expect-error Not sure why this breaks
                                params: { slug },
                                locale,
                            });
                        }
                    }
                }
            }
        }
        if (this.debug) {
            console.log("kjam/content::getStaticPaths", paths);
        }
        return {
            fallback,
            paths,
        };
    }
    async getStaticProps(ctx, routeType = "", otherProps = {}, options = {}) {
        const { params, locale } = ctx;
        const entry = await this.get(routeType, params?.slug || "", locale);
        if (!entry) {
            return {
                notFound: true,
            };
        }
        const mdx = await this.getEntryMdx(entry);
        return { props: { mdx, entry, ...otherProps }, ...options };
    }
    async getEntryMdx(entry) {
        const mdx = await serialize(entry.body, { scope: entry.data });
        return mdx;
    }
}
/**
 * This provides a default Content class configuration instance
 */
const kjam = new ContentNext();

export { ContentNext, kjam };
