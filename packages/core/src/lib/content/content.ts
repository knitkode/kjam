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
    console.log("treatBodyImagestreatBodyImagestreatBodyImagestreatBodyImages")
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
