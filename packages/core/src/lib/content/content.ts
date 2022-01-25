import { join } from "path";
import type { Entry } from "../types";
import { ApiGit } from "../api/api-git";
import { Img } from "../img/img";

export abstract class Content {
  static api = ApiGit;

  static debug = process.env["KJAM_DEBUG"] === "true";

  static async treatBody<T>(entry: Entry<T>) {
    const body = await Content.treatBodyImages(entry);

    return body;
  }

  static async treatBodyImages<T>(entry: Entry<T>) {
    const { dir, body } = entry;
    const relativePath = dir;
    const baseUrl = this.api.getUrl(relativePath);
    const regex = /\!\[.+\]\(.+\)/gm;
    const matches = body.match(regex);
    let output = body;

    // FIXME: disabled for fs problem in middleware
    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const img = new Img(match, baseUrl);
        const replacement = await img.toComponent();
        output = body.replace(match, replacement);
      }
    }

    return output;
  }

  static processDataPortion(data: any, key: any, baseDir: string) {
    if (typeof data[key] === "string") {
      const currentValue = data[key];
      if (currentValue.endsWith(".jpg") || currentValue.endsWith(".jpeg") || currentValue.endsWith(".png")) {
        data[key] = Content.api.getUrl(join(baseDir, currentValue));
        // console.log("transformed: ", data[key]);
      }
    } else if (Array.isArray(data[key])) {
      const subdata = data[key];
      // console.log("is array", key);

      for (let i = 0; i < subdata.length; i++) {
        Content.processDataPortion(subdata, i, baseDir);
      }
    } else if (
      Object.prototype.toString.call(data[key]).slice(8, -1) === "Object"
    ) {
      const subdata = data[key];
      // console.log("is object", key);

      for (const subkey in subdata) {
        Content.processDataPortion(subdata, subkey, baseDir);
      }
    }

    return data;
  }

  static async treatDataImages<T>(entry: any) {
    for (const key in entry.data) {
      if (Object.prototype.hasOwnProperty.call(entry.data, key)) {
        Content.processDataPortion(
          entry.data,
          key,
          entry.dir
        );
      }
    }

    return entry as Entry<T>;
  }

  static async treatAllImages<T>(entry: any) {
    entry = await Content.treatDataImages(entry);
    entry.body = await Content.treatBodyImages(entry);

    return entry as Entry<T>;
  }

  /**
   * About img regex replace:
   * @see https://regex101.com/r/Wefgyy/1
   */
  // static treatContent(meta: EntryMeta, content: string = "") {
  //   const relativePath = meta.dir;
  //   const baseUrl = this.url + relativePath;
  //   const imgRegex = /(\!\[.+\])\((\.)(.+)\)/gm;
  //   const imgSubst = `$1(${baseUrl}$3)`;
  //   const output = content.replace(imgRegex, imgSubst);

  //   return output;
  // }
}
