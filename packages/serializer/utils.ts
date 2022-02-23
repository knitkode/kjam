import { existsSync, readdirSync } from "fs-extra";
import { read } from "gray-matter";
import { load, JSON_SCHEMA } from "js-yaml";
import type { Kjam, EntryMeta, EntryMatter, EntryRoute } from "@kjam/core";
import {
  normalisePathname,
  // } from "@kjam/core";
} from "../core";

/**
 * Only keep `.md` and `.mdx` files based on filename
 */
export function filterMarkdownFiles(filenameOrPath: string) {
  return filenameOrPath.endsWith(".md") || filenameOrPath.endsWith(".mdx");
}

export function extractMeta(filepath: string, i18n: Kjam.I18n): EntryMeta {
  const pathParts = filepath.split("/");
  const filename = pathParts[pathParts.length - 1];
  // clean directory from path, e.g. "./news/a-title/index.it.md" to "news/a-title"
  const dir = normalisePathname(
    pathParts.slice(0, -1).join("/").replace(/\./g, "")
  );
  // const dirParts = dir.split("/");
  // const parentDirs = dirParts.slice(0, -1).join("/");
  const filenameParts = filename.split(".");
  // const ext = filenameParts[filenameParts.length - 1];
  // const basename = filename.replace(`.${ext}`, "");
  const locale =
    filenameParts.length > 2
      ? filenameParts[filenameParts.length - 2]
      : i18n.defaultLocale;

  return {
    dir,
    // parentDirs,
    // filename,
    // basename,
    // ext,
    locale,
  };
}

/**
 * Quickly clean markdown specific syntax and mdx imports and components
 */
function getExcerpt(content: string, maxChars = 160) {
  const cleaned = content.replace(
    /<[\n|\s|\S|.]*?>|\n|!\[.*?\]|\[|\]|\(.*?\)|#.*?\n|import\s.*?\n|\*|\*\*|_|__|>.*?\n/gm,
    ""
  );
  let truncated = cleaned.slice(0, maxChars + 0);

  if (cleaned.length > maxChars) {
    truncated += "...";
  }

  return truncated;
}

export function extractMatter<T>(filepath: string): EntryMatter<T> {
  const { content, excerpt, data } = read(filepath, {
    excerpt: true,
    engines: {
      // turn off automatic date parsing
      // @see https://github.com/jonschlinkert/gray-matter/issues/62#issuecomment-577628177
      // @ts-expect-error I don't think this is important
      yaml: (s) => load(s, { schema: JSON_SCHEMA }),
    },
  });
  return {
    body: content,
    excerpt: excerpt || getExcerpt(content),
    data: data as T,
  };
}

export function extractRoute<T>(
  meta: EntryMeta,
  matter: EntryMatter<T>,
  urls: Kjam.Urls
): EntryRoute {
  const { dir } = meta;
  const dirParts = dir.split("/");
  const matterSlugParts = matter.data?.slug?.split("/") ?? [];
  // pages ids get the `pages/` part stripped out to act as root level routes
  const id = dir.replace("pages/", "");
  // get the parent path of the entry's directory
  const parentDirs = dirParts
    .slice(0, -1)
    .join("/")
    .replace(/(pages\/*).*$/, "");
  // use last portion of the frontmatter defined `slug` key as priority slug
  const slugFromMatter = matterSlugParts[matterSlugParts.length - 1];
  // use last portion of the directory/id as fallback slug
  const slugFromDir = dirParts[dirParts.length - 1];
  // normalize the slug
  let slug = normalisePathname(slugFromMatter || slugFromDir || "");
  // special homepage case
  slug = slug === "home" ? "" : slug;

  const templateSlug = normalisePathname(`${parentDirs}/${slug}`);

  // const url = (urlPrepend ? `${urlPrepend}/` : urlPrepend) + slug;

  // remove the slug from frontmatter to avoid ambiguity, that one is
  // just represents what is coming from the CMS 'database' but the one to
  // use is the `slug` at the root level of the entry object
  delete matter.data.slug;

  return {
    id,
    templateSlug,
    slug: "",
    url: "",
  };
}

/**
 * Check if the given folder path is a folder containing a collection of entries
 */
export function isCollectionPath(fullpath: string) {
  if (!existsSync(fullpath)) {
    return false;
  }
  const children = readdirSync(fullpath, { withFileTypes: true });

  return (
    children.filter((dirent) => {
      const isDir = dirent.isDirectory();
      if (!isDir) return false;
      const { name } = dirent;
      // TODO: test for this behaviour...
      return name !== "media" && name !== "photos" && name !== "images";
    }).length > 0
  );
}

export async function replaceAsync(
  str: string,
  regex: RegExp,
  asyncFn: (...args: any[]) => Promise<string>
) {
  const promises: Promise<string>[] = [];
  // @ts-expect-error FIXME: No time for this...
  str.replace(regex, (...args) => {
    promises.push(asyncFn(...args));
  });
  const data = await Promise.all(promises);
  // @ts-expect-error FIXME: No time for this...
  return str.replace(regex, () => data.shift());
}

export function parseUrl<T extends Record<string, unknown> = {}>(url = "") {
  const [path, query] = url.split("?");
  const params = Object.fromEntries(new URLSearchParams(query)) as T;
  const relative = /^(?!\/\/)[.|/]/.test(path);
  const ext = path.match(/.+(\.[a-zA-Z0-9]+)$/)?.[1];

  return {
    path,
    query: query ? `?${query}` : "",
    params,
    relative,
    file: !!ext,
    ext,
  };
}
