import { join } from "path";
import { readdirSync } from "fs-extra";
import { read } from "gray-matter";
import { load, JSON_SCHEMA } from "js-yaml";
import type {
  Api,
  Kjam,
  Entry,
  EntryMeta,
  EntryMatter,
  EntryRoute,
} from "@kjam/core";
import type { SerializerBodyImgTransformer } from "./serializer";
import { normalisePathname } from "../../core/src"; // @kjam/core

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
  const { dir, locale } = meta;
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
  // extract locale from frontmatter or use last portion of the directory
  let slug = normalisePathname(slugFromMatter || slugFromDir || "");
  // special homepage case
  slug = slug === "home" ? "" : slug;

  const templateSlug = normalisePathname(`${parentDirs}/${slug}`);

  // prepend the dynamic part of the slug (if any) by reading the routes structure
  // which should match this entry's parent directories path.
  const url = urls?.[id]?.[locale] || "";
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
    id,
    templateSlug,
    slug,
    url,
  };
}

/**
 * Check if the given folder path is a folder containing a collection of entries
 */
export function isCollectionPath(fullpath: string) {
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

/**
 * Get translated link
 *
 */
function getTranslatedLink(raw: string, entry: Entry<any>, urls: Kjam.Urls) {
  let id = "";
  const isRelative = /^(?!\/\/)[.|/]/.test(raw);
  if (!isRelative) {
    return raw;
  }
  const startsWithDot = raw[0] === ".";
  if (startsWithDot) {
    const rawPath = raw.replace(/\/index\..+/, "");
    id = join(entry.dir, rawPath);
  } else {
    id = raw;
  }

  return urls[id]?.[entry.locale] || raw;
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
      treatDataLinksSlice(entry.data, key, entry, urls);
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

/**
 * Get entry's `body` managing images
 */
async function treatBodyImages<T>(
  entry: Pick<Entry<T>, "dir" | "body">,
  api: Api,
  mdImgTransformer: SerializerBodyImgTransformer
) {
  const { body } = entry;
  const baseUrl = api.getUrl(entry.dir);
  const regex = /!\[.+\]\(.+\)/gm;
  const matches = body.match(regex);
  let output = body;
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const replacement = await mdImgTransformer(match, baseUrl);
      output = body.replace(match, replacement);
    }
  }

  return output;
}

/**
 * Get entry managing images in `data`
 */
async function treatDataImages<T>(entry: any, api: Api) {
  for (const key in entry.data) {
    if (key !== "body") {
      treatDataImagesSlice(entry.data, key, entry.dir, api);
    }
  }

  return entry as Entry<T>;
}

/**
 * Get entry managing all images both in` body` and `data`
 */
export async function treatAllImages<T>(
  entry: any,
  api: Api,
  mdImgTransformer: SerializerBodyImgTransformer
) {
  entry = await treatDataImages(entry, api);
  entry.body = await treatBodyImages(entry, api, mdImgTransformer);

  return entry as Entry<T>;
}

function treatDataImagesSlice(data: any, key: any, baseDir: string, api: Api) {
  if (typeof data[key] === "string") {
    const currentValue = data[key];
    if (
      currentValue.endsWith(".jpg") ||
      currentValue.endsWith(".jpeg") ||
      currentValue.endsWith(".png")
    ) {
      data[key] = api.getUrl(join(baseDir, currentValue));
      // console.log("transformed: ", data[key]);
    }
  } else if (Array.isArray(data[key])) {
    // console.log("is array", key);
    for (let i = 0; i < data[key].length; i++) {
      treatDataImagesSlice(data[key], i, baseDir, api);
    }
  } else if (
    Object.prototype.toString.call(data[key]).slice(8, -1) === "Object"
  ) {
    // console.log("is object", key);
    for (const subkey in data[key]) {
      treatDataImagesSlice(data[key], subkey, baseDir, api);
    }
  }
}

function treatDataLinksSlice(
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
      treatDataLinksSlice(data[key], i, entry, urls);
    }
  } else if (
    Object.prototype.toString.call(data[key]).slice(8, -1) === "Object"
  ) {
    // console.log("is object", key);
    for (const subkey in data[key]) {
      treatDataLinksSlice(data[key], subkey, entry, urls);
    }
  }
}
