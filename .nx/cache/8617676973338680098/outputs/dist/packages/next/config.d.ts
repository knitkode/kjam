import "dotenv/config";
import type { NextConfig } from "next";
import type { I18nConfig } from "next-translate";
export type KjamConfig = {
    permanentRedirects?: boolean;
};
/**
 * With kjam next configuration
 *
 * The `i18n` next configuration cannot be retrieved asynchronously
 * so it needs to match the remote content one.
 * We rely on `next-translate` assuming that is always used, even for a single
 * language application. `next-translate` is used as a dependency too in this
 * package, so no need to install it in the app consuming `kjam`.
 */
export declare const withKjam: (config?: NextConfig & KjamConfig) => {
    nextConfig: NextConfig;
    translateConfig: (i18nConfig?: Omit<I18nConfig, "locales" | "defaultLocale" | "extensionsRgx" | "logBuild" | "loadLocaleFrom">) => I18nConfig;
};
export default withKjam;
