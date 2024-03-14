import { join } from "path";
import type { Api, Kjam, Entry } from "@kjam/core";
import {
  normalisePathname,
} from "@kjam/core";
import { parseUrl } from "./utils";

/**
 * Get translated link
 *
 */
function getTranslatedLink(
  raw: string,
  entry: Entry<any>,
  api: Api,
  urls: Kjam.Urls
) {
  let id = "";
  const { path, relative, file, query } = parseUrl(raw);
  if (!relative) {
    return raw;
  }
  const startsWithDot = path[0] === ".";
  if (startsWithDot) {
    const relativePath = path.replace(/\/index\..+/, "");
    id = join(entry.dir, relativePath);
  } else {
    id = normalisePathname(path);
  }

  if (file) {
    return `${api.getUrl(id)}${query}`;
  }

  return urls[id as Kjam.RouteId]?.[entry.locale] || raw;
  // raw.match(/[\.|\/]*(.+)/)[1]
}

/**
 * Get entry's `body` managing links
 */
function treatBodyLinks(entry: Entry<any>, api: Api, urls: Kjam.Urls) {
  // support for returns within title or href:
  // const regex = /\[([\s|\S|.]*?)\][\s|\S]*?\(([\s|\S|.]+?)\)/gm;
  const regex = /\[(.+)\][\s|\S]*?\((.+)\)/gm;
  let { body } = entry;

  body = body.replace(regex, (_match, text, url) => {
    return `[${text}](${getTranslatedLink(url, entry, api, urls)})`;
  });

  return body;
}

/**
 * Get entry managing links in `data`
 */
function treatDataLinks<T>(entry: any, api: Api, urls: Kjam.Urls) {
  for (const key in entry.data) {
    if (key !== "body") {
      treatDataLinksSlice(entry.data, key, entry, api, urls);
    }
  }

  return entry as Entry<T>;
}

/**
 * Get entry managing all links both in` body` and `data`
 */
export function treatAllLinks<T>(entry: any, api: Api, urls: Kjam.Urls) {
  entry = treatDataLinks(entry, api, urls);
  entry.body = treatBodyLinks(entry, api, urls);

  return entry as Entry<T>;
}

function treatDataLinksSlice(
  data: any,
  key: any,
  entry: Entry<any>,
  api: Api,
  urls: Kjam.Urls
) {
  if (typeof data[key] === "string") {
    const currentValue = data[key];

    if (/^([\s|.]*\/)+/.test(currentValue)) {
      data[key] = getTranslatedLink(currentValue, entry, api, urls);
      // console.log("transformed: ", data[key]);
    } else {
      const regex = /(\[[\s|\S]*?\])\(([\s\S]*?)\)/gm;
      data[key] = currentValue.replace(
        regex,
        (_: string, text: string, url: string) => {
          if (text && url) {
            return `${text}(${getTranslatedLink(
              url,
              entry,
              api,
              urls
            )})`;
          }
          return _;
        }
      );
    }
  } else if (Array.isArray(data[key])) {
    // console.log("is array", key);
    for (let i = 0; i < data[key].length; i++) {
      treatDataLinksSlice(data[key], i, entry, api, urls);
    }
  } else if (
    Object.prototype.toString.call(data[key]).slice(8, -1) === "Object"
  ) {
    // console.log("is object", key);
    for (const subkey in data[key]) {
      treatDataLinksSlice(data[key], subkey, entry, api, urls);
    }
  }
}
