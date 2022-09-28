import "dotenv/config";
import type {
  GetStaticPropsContext,
  GetStaticPropsResult,
  GetStaticPathsContext,
  GetStaticPathsResult,
} from "next";
import { Entry, normalisePathname } from "@kjam/core";
import { Content, ContentConfig } from "@kjam/core";
import { serialize } from "./mdx";
import type { KjamProps } from "./index";

type StaticPathsParams = {
  slug: string | string[];
};

type StaticPathsType = true | false;

type StaticPathSlug<SlugAsString> = SlugAsString extends true
  ? string
  : SlugAsString extends false
  ? string[]
  : never;

// interface StaticPathAsString {
//   params: {
//     slug: string;
//   };
//   locale: string;
// };

// interface StaticPathsAsArray {
//   params: {
//     slug: string[];
//   };
//   locale: string;
// };

// type StaticPaths<SlugAsString> = SlugAsString extends true
//   ? StaticPathAsString
//   : SlugAsString extends false
//   ? StaticPathsAsArray
//   : never;

export type ContentNextConfig = ContentConfig & {};

export class ContentNext extends Content {
  /**
   * @param context We grab the `locales` from this
   * @param fallback Defaults to `"blocking"`
   * @param routeType Defaults to `""`
   * @param asString Defaults to `false`
   * @returns
   */
  async getStaticPaths<
    Params extends StaticPathsParams = StaticPathsParams,
    Type extends StaticPathsType = boolean
  >(
    context: GetStaticPathsContext,
    fallback: GetStaticPathsResult["fallback"] = "blocking",
    routeType = "",
    asString?: Type
  ): Promise<GetStaticPathsResult<Params>> {
    const ctxLocalesMap =
      context.locales?.reduce((map, locale) => {
        map[locale] = true;
        return map;
      }, {} as Record<string, true>) ?? {};
    const paths: GetStaticPathsResult<Params>["paths"] = [];
    const { byRoute } = await this.api.getMaps();

    // the ending slash ensures that we are not gathering the root level `index`
    // entry for the given `routeType` (usually a collection)
    // PAGES:
    // const normalisedRouteType =
    //   normalisePathname(routeType === "pages" ? "" : routeType) + "/";
    const normalisedRouteType = normalisePathname(routeType) + "/";

    for (const [id, locales] of Object.entries(byRoute)) {
      if (id.startsWith(normalisedRouteType)) {
        for (const [locale, entry] of Object.entries(locales)) {
          const slugSegments = entry.templateSlug
            .replace(normalisedRouteType, "")
            .split("/")
            .filter(
              (segment, idx) => segment && !(idx === 0 && segment === "pages")
            );
          let slug;

          if (ctxLocalesMap[locale]) {
            if (asString) {
              if (slugSegments.length === 1) {
                slug = entry.slug as StaticPathSlug<true>;
              }
            } else {
              slug = slugSegments as StaticPathSlug<false>;
            }

            // ensure that slug is not empty array or empty string, next.js does
            // not want that
            if (
              (typeof slug === "string" && slug) ||
              (Array.isArray(slug) && slug.length)
            ) {
              paths.push({
                // @ts-expect-error Not sure why this breaks
                params: { slug },
                locale,
              });
            }
          }
        }
      }
    }

    if (this.debug) {
      console.log("kjam/content::getStaticPaths", paths);
    }

    return {
      fallback,
      paths,
    };
  }

  async getStaticProps<
    Params extends StaticPathsParams = StaticPathsParams,
    Data extends {} = {}
    // ExtraData extends Record<string, any> = {}
  >(
    ctx: GetStaticPropsContext<Params>,
    routeType = "",
    otherProps = {},
    options: Omit<GetStaticPropsResult<Params>, "props"> = {}
  ): Promise<GetStaticPropsResult<KjamProps<Data, Params>>> {
    const { params, locale } = ctx;
    const entry = await this.get<Data>(routeType, params?.slug || "", locale);

    if (!entry) {
      return {
        notFound: true,
      };
    }

    const mdx = await this.getEntryMdx(entry);

    return { props: { mdx, entry, ...otherProps }, ...options };
  }

  async getEntryMdx<T extends {} = {}>(entry: Entry<T>) {
    const mdx = await serialize(entry.body, { scope: entry.data });

    return mdx;
  }
}

/**
 * This allows to instantiate the Content class with custom options
 */
export const Kjam = (config?: ContentNextConfig) => new ContentNext(config);

/**
 * This provides a default Content class configuration instance
 */
export const kjam = new ContentNext();
