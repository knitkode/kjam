import probe from "probe-image-size";

export class Img {
  baseUrl: string;
  md: string;

  originalUrl: string;
  alt?: string;
  source?: string;
  width?: number;
  height?: number;

  constructor(markdownString = "", baseUrl = "") {
    this.md = markdownString;
    this.baseUrl = baseUrl;
    this.originalUrl = "";

    this.parseMarkdown();
  }

  parseMarkdown() {
    const regex = /\!\[(.+)\]\((.+)\)/;
    const matches = this.md.match(regex);

    if (matches) {
      const alt = matches[1];
      const source = matches[2];
      const isRelative = source.startsWith(".");
      const relativeUrl = isRelative ? source.replace(/^\./, "") : "";
      this.originalUrl = relativeUrl ? this.baseUrl + relativeUrl : source;
      this.alt = alt;
    }
  }

  async getInfo() {
    console.log("this.originalUrl", this.originalUrl);
    const start = performance.now();
    const { width, height } = await probe(this.originalUrl);
    // console.log(`Img:getInfo took ${performance.now() - start}ms for image at url ${this.originalUrl}`);

    this.width = width;
    this.height = height;

    return { width, height };
  }

  /**
   * Expected output:
   * ```md
   * ![text](https://ciao.com/path-to-img.jpg)
   * ```
   */
  async toMarkdown() {
    const imgRegex = /(\!\[.+\])\((\.)(.+)\)/gm;
    const imgSubst = `$1(${this.baseUrl}$3)`;
    const output = this.md.replace(imgRegex, imgSubst);

    return output;
  }

  /**
   * Expected output:
   * ```jsx
   * <Img alt="text" src="https://ciao.com/path-to-img.jpg"/>
   * ```
   */
  async toComponent() {
    const { width, height } = await this.getInfo();
    const attributes = `src="${this.originalUrl}" alt="${this.alt}" width={${width}} height={${height}}`;

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
    const { width, height } = await this.getInfo();
    let attributes = `src="${this.originalUrl}" alt="${this.alt}" width={${width}} height={${height}}`;

    return `<img ${attributes} />`;
  }
}
