import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import { type Kjam } from "@kjam/core";
import { Serializer } from "@kjam/serializer";
export type SerializerNextOutputConfig = {
    /**
     * Same as `import("next").NextConfig["i18n"]` but some of these are required.
     *
     * The `i18n` next configuration cannot be retrieved asynchronously
     * so it must be passed set here and it needs to match the remote content
     * one.
     *
     * TODO: implement a check if a mismatch happens and report to the user
     */
    i18n: Kjam.I18n;
    redirects: Redirect[];
    rewrites: Rewrite[];
};
export declare class SerializerNext extends Serializer {
    transformBodyImage(markdownImg: string): Promise<string>;
    start(): Promise<void>;
    /**
     * Get `redirects` config for `next.config.js`
     */
    getRedirects(): {
        source: string;
        destination: string;
        permanent: boolean;
        locale: boolean;
    }[];
    /**
     * Get `rewrites` config for `next.config.js`
     */
    getRewrites(): {
        source: string;
        destination: string;
    }[];
    getPathRewrite(source: string, destination: string, dynamic?: boolean): {
        source: string;
        destination: string;
    };
    getPathRedirect(locale: string, localisedPathname: string, templateName: string, dynamic?: boolean): {
        source: string;
        destination: string;
        permanent: boolean;
        locale: boolean;
    };
}
