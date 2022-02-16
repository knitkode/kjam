// import probe from "probe-image-size";

import { parseUrl } from "./utils";

export type ImgUrlParams = {
  w?: string | number;
  width?: string | number;
  h?: string | number;
  height?: string | number;
  ratio?: string;
};

export class Img {
  // baseUrl: string;
  md: string;

  originalUrl: string;
  alt?: string;
  source?: string;
  // width?: number;
  // height?: number;

  constructor(markdownString = "") {
    this.md = markdownString;
    this.originalUrl = "";

    this.parseMarkdown();
  }

  parseMarkdown() {
    const regex = /!\[(.+)\]\((.+)\)/;
    const matches = this.md.match(regex);

    if (matches) {
      const alt = matches[1];
      const source = matches[2];
      // const isRelative = source.startsWith(".");
      // const relativeUrl = isRelative ? source.replace(/^\./, "") : "";
      // this.originalUrl = relativeUrl ? this.baseUrl + relativeUrl : source;
      this.originalUrl = source;
      this.alt = alt;
    }
  }

  async getInfoFromParams() {
    const { params } = parseUrl<ImgUrlParams>(this.originalUrl);
    const width = Number(params.width || params.w) || 0;
    const height = Number(params.height || params.h) || 0;
    const ratio = params.ratio || "";
    // console.log("kjam/img::getInfoFromParams originalUrl is", this.originalUrl);
    // const start = performance.now();
    // const { width, height } = await probe(this.originalUrl);
    // console.log(`kjam/img:getInfoFromParams took ${performance.now() - start}ms for image at url ${this.originalUrl}`);
    return { width, height, ratio };
  }

  /**
   * Expected output:
   * ```md
   * ![text](https://ciao.com/path-to-img.jpg)
   * ```
   */
  // async toMarkdown() {
  //   const imgRegex = /(!\[.+\])\((\.)(.+)\)/gm;
  //   const imgSubst = `$1(${this.baseUrl}$3)`;
  //   const output = this.md.replace(imgRegex, imgSubst);

  //   return output;
  // }

  /**
   * Expected output:
   * ```jsx
   * <Img alt="text" src="https://ciao.com/path-to-img.jpg"/>
   * ```
   */
  async toComponent(attrs?: string) {
    const { width, height, ratio } = await this.getInfoFromParams();
    let attributes = `src="${this.originalUrl}" alt="${this.alt}"`;
    attributes += width ? ` width={${width}}` : "";
    attributes += height ? ` height={${height}}` : "";
    attributes += ratio ? ` ratio="${ratio}"` : "";

    if (attrs) {
      attributes += ` ${attrs}`;
    }

    return `<Img ${attributes} />`;
  }

  /**
   * Expected output:
   * ```html
   * <img alt="text" src="https://ciao.com/path-to-img.jpg" />
   * ```
   *
   * @see https://regex101.com/r/slDmIl/1
   */
  async toHtml() {
    const { width, height, ratio } = await this.getInfoFromParams();
    let attributes = `src="${this.originalUrl}" alt="${this.alt}"`;
    attributes += width ? ` width="${width}"` : "";
    attributes += height ? ` height="${height}"` : "";
    attributes += ratio ? ` data-ratio="${ratio}"` : "";

    return `<img ${attributes} />`;
  }
}
