import { read } from "gray-matter";
import { load, JSON_SCHEMA } from "js-yaml";
import type { EntryMeta, EntryMatter, EntryRoute } from "@kjam/core";
import { normalisePathname } from "../../core/src"; // @kjam/core

/**
 * Only keep `.md` and `.mdx` files based on filename
 */
export function filterMarkdownFiles(filenameOrPath: string) {
  return filenameOrPath.endsWith(".md") || filenameOrPath.endsWith(".mdx");
}

export function extractMeta(filepath: string): EntryMeta {
  const pathParts = filepath.split("/");
  const filename = pathParts[pathParts.length - 1];
  // clean directory from path, e.g. "./news/a-title/index.it.md" to "news/a-title"
  const dir = pathParts.slice(0, -1).join("/").replace("./", "/");
  // extract directory from path, e.g. "./news/a-title/index.it.md"
  // results to "news/a-title"
  const dirParts = dir.split("/");
  const parentDirs = dirParts.slice(0, -1).join("/");
  const filenameParts = filename.split(".");
  const ext = filenameParts[filenameParts.length - 1];
  const basename = filename.replace(`.${ext}`, "");
  const locale =
    filenameParts.length > 2
      ? filenameParts[filenameParts.length - 2]
      : "default";

  return {
    dir,
    parentDirs,
    filename,
    basename,
    ext,
    locale,
  };
}

export function extractMatter<T>(filepath: string): EntryMatter<T> {
  const { content, excerpt, data } = read(filepath, {
    excerpt: true,
    // FIXME: eval is not allowed in middleware, not sure if that is a problem,
    // as it is enabled by default
    // eval: false,
    engines: {
      // turn off automatic date parsing
      // @see https://github.com/jonschlinkert/gray-matter/issues/62#issuecomment-577628177
      // @ts-expect-error I don't think this is important
      yaml: (s) => load(s, { schema: JSON_SCHEMA }),
    },
  });
  return { body: content, excerpt, data: data as T };
}

export function extractRoute<T>(
  meta: EntryMeta,
  matter: EntryMatter<T>
): EntryRoute {
  const { dir, parentDirs, locale } = meta;
  // pages routes ids get the `pages/`  part stripped out to act as root level
  // pages
  const routeId = dir.replace(/^\//, "").replace("pages/", "");
  // extract locale from frontmatter or use routeId
  const slug = normalisePathname(matter.data?.slug || routeId);

  // get only the last part of the slug, FIXME: this is temporary...just
  // remove the translated folder path from all localised slugs in the frontmatter
  // section
  const slugParts = slug.split("/").filter((part) => !!part);
  let templateDynamicSlug = slugParts[slugParts.length - 1];
  // FIXME: ?this was causing the issue?
  // if (slugParts.length === 1) {
  //   templateDynamicSlug = routeId;
  // }
  // the homepage should get here
  if (!slugParts.length) {
    templateDynamicSlug = "";
  }

  let templateFolder = parentDirs.replace(/^\//, "") + "/";
  // pages should be handled at the root level in the `pages/` next folder
  // structure so we strip out the templateFolder
  if (templateFolder === "pages/") {
    templateFolder = "";
  }

  const templateSlug = templateFolder + templateDynamicSlug;

  return {
    routeId,
    locale,
    slug,
    // FIXME: understand this...templateSLug..what is it meant to be?
    templateSlug,
  };
}
