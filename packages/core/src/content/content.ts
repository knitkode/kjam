import { join } from "path";
import type { Entry } from "../types";
import { Api } from "../api/api";
import { ApiGit } from "../api/api-git";
import { Img } from "../img/img";

export abstract class Content {
  api: Api;
  debug?: boolean;

  constructor() {
    this.api = new ApiGit();
    this.debug = process.env["KJAM_DEBUG"] === "true";
  }

  async treatBody<T>(entry: Entry<T>) {
    const body = await this.treatBodyImages(entry);

    return body;
  }

  async treatBodyImages<T>(entry: Entry<T>) {
    const { body } = entry;
    const baseUrl = this.api.getUrl(entry.dir);
    const regex = /!\[.+\]\(.+\)/gm;
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

  processDataSlice(data: any, key: any, baseDir: string) {
    if (typeof data[key] === "string") {
      const currentValue = data[key];
      if (
        currentValue.endsWith(".jpg") ||
        currentValue.endsWith(".jpeg") ||
        currentValue.endsWith(".png")
      ) {
        data[key] = this.api.getUrl(join(baseDir, currentValue));
        // console.log("transformed: ", data[key]);
      }
    } else if (Array.isArray(data[key])) {
      // console.log("is array", key);
      for (let i = 0; i < data[key].length; i++) {
        this.processDataSlice(data[key], i, baseDir);
      }
    } else if (
      Object.prototype.toString.call(data[key]).slice(8, -1) === "Object"
    ) {
      // console.log("is object", key);
      for (const subkey in data[key]) {
        this.processDataSlice(data[key], subkey, baseDir);
      }
    }
  }

  async treatDataImages<T>(entry: any) {
    for (const key in entry.data) {
      if (
        Object.prototype.hasOwnProperty.call(entry.data, key) &&
        key !== "body"
      ) {
        this.processDataSlice(entry.data, key, entry.dir);
      }
    }

    return entry as Entry<T>;
  }

  async treatAllImages<T>(entry: any) {
    entry = await this.treatDataImages(entry);
    entry.body = await this.treatBodyImages(entry);

    return entry as Entry<T>;
  }

  /**
   * About img regex replace:
   * @see https://regex101.com/r/Wefgyy/1
   */
  // treatContent(meta: EntryMeta, content: string = "") {
  //   const relativePath = meta.dir;
  //   const baseUrl = this.url + relativePath;
  //   const imgRegex = /(\!\[.+\])\((\.)(.+)\)/gm;
  //   const imgSubst = `$1(${baseUrl}$3)`;
  //   const output = content.replace(imgRegex, imgSubst);

  //   return output;
  // }
}
