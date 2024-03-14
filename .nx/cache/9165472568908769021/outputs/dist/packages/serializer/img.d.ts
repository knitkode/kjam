export type ImgUrlParams = {
    w?: string | number;
    width?: string | number;
    h?: string | number;
    height?: string | number;
    ratio?: string;
};
export declare class Img {
    md: string;
    originalUrl: string;
    alt?: string;
    source?: string;
    constructor(markdownString?: string);
    parseMarkdown(): void;
    getInfoFromParams(): Promise<{
        width: number;
        height: number;
        ratio: string;
    }>;
    /**
     * Expected output:
     * ```md
     * ![text](https://ciao.com/path-to-img.jpg)
     * ```
     */
    /**
     * Expected output:
     * ```jsx
     * <Img alt="text" src="https://ciao.com/path-to-img.jpg"/>
     * ```
     */
    toComponent(attrs?: string): Promise<string>;
    /**
     * Expected output:
     * ```html
     * <img alt="text" src="https://ciao.com/path-to-img.jpg" />
     * ```
     *
     * @see https://regex101.com/r/slDmIl/1
     */
    toHtml(): Promise<string>;
}
