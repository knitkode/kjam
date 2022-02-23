import "dotenv/config";
import type {
  GetStaticPropsContext,
  GetStaticPropsResult,
  GetStaticPathsContext,
  GetStaticPathsResult,
} from "next";
// import { serialize } from "next-mdx-remote/serialize";
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

    // FIXME:
    // routeType = routeType === "pages" ? "" : "";

    // the ending slash ensures that we are not gathering the root level `index`
    // entry for the given `routeType` (usually a collection)
    routeType = normalisePathname(routeType) + "/";

    for (const [id, locales] of Object.entries(byRoute)) {
      if (id.startsWith(routeType)) {
        for (const [locale, entry] of Object.entries(locales)) {
          const slugSegments = entry.templateSlug
            .replace(routeType, "")
            .split("/")
            .filter((segment) => segment);
          let slug;

          if (ctxLocalesMap[locale]) {
            if (asString) {
              if (slugSegments.length === 1) {
                slug = entry.slug as StaticPathSlug<true>;
              }
            } else {
              slug = slugSegments as StaticPathSlug<false>;
            }

            if (slug) {
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

  async getEntryMdx<T>(entry: Entry<T>) {
    const mdx = await serialize(entry.body, { scope: entry.data });

    return mdx;
  }
}

export const kjam = new ContentNext();
