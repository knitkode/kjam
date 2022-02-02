import { join } from "path";
import { fdir } from "fdir";
import { read } from "gray-matter";
import { load, JSON_SCHEMA } from "js-yaml";
import type {
  Kjam,
  Entry,
  EntryMeta,
  EntryMatter,
  EntryRoute,
} from "@kjam/core";
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
      : "default";

  return {
    dir,
    // parentDirs,
    // filename,
    // basename,
    // ext,
    locale,
  };
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
  return { body: content, excerpt, data: data as T };
}

export function extractRoute<T>(
  meta: EntryMeta,
  matter: EntryMatter<T>,
  urls: Kjam.Urls
): EntryRoute {
  const { dir, locale } = meta;
  const dirParts = dir.split("/");
  const matterSlugParts = matter.data?.slug?.split("/") ?? [];
  // pages ids get the `pages/` part stripped out to act as root level routes
  const routeId = dir.replace("pages/", "");
  // get the parent path of the entry's directory
  const parentDirs = dirParts
    .slice(0, -1)
    .join("/")
    .replace(/(pages\/*).*$/, "");
  // use last portion of the frontmatter defined `slug` key as priority slug
  const slugFromMatter = matterSlugParts[matterSlugParts.length - 1];
  // use last portion of the directory/routeId as fallback slug
  const slugFromDir = dirParts[dirParts.length - 1];
  // extract locale from frontmatter or use last portion of the directory
  let slug = normalisePathname(slugFromMatter || slugFromDir || "");
  // special homepage case
  slug = slug === "home" ? "" : slug;

  const templateSlug = normalisePathname(`${parentDirs}/${slug}`);

  // prepend the dynamic part of the slug (if any) by reading the routes structure
  // which should match this entry's parent directories path.
  const url = urls?.[routeId]?.[locale] || "";
  // const url = (urlPrepend ? `${urlPrepend}/` : urlPrepend) + slug;

  // update the slug read from frontmatter too, as it might be wrongly defined
  // as a nested path like /projects/my-project, `slug` inside frontmatter
  // should instead just be a single pathname
  if (slugFromMatter) {
    matter.data.slug = url.split("/")[url.split("/").length - 1];
  }
  // remove the slug from frontmatter to avoid ambiguity, the one
  // there is representing what is coming from the CMS 'database' but the one to
  // use is the `slug` at the root level of the entry object
  delete matter.data.slug;

  return {
    routeId,
    locale,
    templateSlug,
    slug,
    url,
  };
}

/**
 * Check if the given folder path is a folder containing a collection of entries
 */
export async function isCollectionPath(fullpath: string) {
  const quantity = (await new fdir()
    .onlyCounts()
    // .withRelativePaths()
    .crawl(fullpath)
    .withPromise()) as { files: number; dirs: number };
  // console.log(">", fullpath, quantity)
  return quantity.dirs > 1;
}

/**
 * Get translated link
 *
 */
function getTranslatedLink(raw: string, entry: Entry<any>, urls: Kjam.Urls) {
  let routeId = "";
  const isRelative = /^(?!\/\/)[.|/]/.test(raw);
  if (!isRelative) {
    return raw;
  }
  const startsWithDot = raw[0] === ".";
  if (startsWithDot) {
    const rawPath = raw.replace(/\/index\..+/, "");
    routeId = join(entry.dir, rawPath);
  } else {
    routeId = raw;
  }

  return urls[routeId]?.[entry.locale] || raw;
  // raw.match(/[\.|\/]*(.+)/)[1]
}

/**
 * Get entry's `body` managing links
 */
function treatBodyLinks(entry: Entry<any>, urls: Kjam.Urls) {
  // support for returns within title or href:
  // const regex = /\[([\s|\S|.]*?)\][\s|\S]*?\(([\s|\S|.]+?)\)/gm;
  const regex = /\[(.+)\][\s|\S]*?\((.+)\)/gm;
  let { body } = entry;

  body = body.replace(regex, (_match, text, url) => {
    return `[${text}](${getTranslatedLink(url, entry, urls)})`;
  });

  return body;
}

/**
 * Get entry managing links in `data`
 */
function treatDataLinks<T>(entry: any, urls: Kjam.Urls) {
  for (const key in entry.data) {
    if (key !== "body") {
      processDataSlice(entry.data, key, entry, urls);
    }
  }

  return entry as Entry<T>;
}

/**
 * Get entry managing all links both in` body` and `data`
 */
export function treatAllLinks<T>(entry: any, urls: Kjam.Urls) {
  entry = treatDataLinks(entry, urls);
  entry.body = treatBodyLinks(entry, urls);

  return entry as Entry<T>;
}

function processDataSlice(
  data: any,
  key: any,
  entry: Entry<any>,
  urls: Kjam.Urls
) {
  if (typeof data[key] === "string") {
    const currentValue = data[key];
    if (/^([\s|.]*\/)+/.test(currentValue)) {
      data[key] = getTranslatedLink(currentValue, entry, urls);
      // console.log("transformed: ", data[key]);
    }
  } else if (Array.isArray(data[key])) {
    // console.log("is array", key);
    for (let i = 0; i < data[key].length; i++) {
      processDataSlice(data[key], i, entry, urls);
    }
  } else if (
    Object.prototype.toString.call(data[key]).slice(8, -1) === "Object"
  ) {
    // console.log("is object", key);
    for (const subkey in data[key]) {
      processDataSlice(data[key], subkey, entry, urls);
    }
  }
}
