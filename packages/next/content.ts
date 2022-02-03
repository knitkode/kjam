import "dotenv/config";
import type {
  GetStaticPropsContext,
  GetStaticPropsResult,
  GetStaticPathsContext,
  GetStaticPathsResult,
} from "next";
import type { serialize } from "next-mdx-remote/serialize";
import type { Entry } from "@kjam/core";
import { Content, ContentConfig } from "@kjam/core";
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
   * @param context Unused for now
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
  ) {
    // const { locales, defaultLocale } = context;
    const { byRoute } = await this.api.getMaps();
    const paths: GetStaticPathsResult<Params>["paths"] = [];

    // FIXME:
    // routeType = routeType === "pages" ? "" : "";

    for (const [id, locales] of Object.entries(byRoute)) {
      if (id.startsWith(routeType)) {
        for (const [locale, entry] of Object.entries(locales)) {
          let slug;

          if (asString) {
            slug = entry.templateSlug as StaticPathSlug<true>;
          } else {
            slug = entry.templateSlug.split("/") as StaticPathSlug<false>;
          }

          if (slug) {
            paths.push({
              // @ts-expect-error Not sure why this breaks
              params: { slug },
              locale: locale,
            });
            // console.log(
            //   `kjam/content::getStaticPaths routeType ${routeType}, slug: ${slug}`
            // );
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
    mdxSerializer: typeof serialize,
    routeType = "",
    additionalData = {}
  ): Promise<GetStaticPropsResult<KjamProps<Data, Params>>> {
    const { params, locale } = ctx;
    const entry = await this.get<Data>(routeType, params?.slug || "", locale);

    if (!entry) {
      return {
        notFound: true,
      };
    }

    const mdx = await mdxSerializer(entry.body, { scope: entry.data });
    return { props: { mdx, entry, ...additionalData } };
  }

  async getEntryMdx<T>(entry: Entry<T>, mdxSerializer?: typeof serialize) {
    const mdx = mdxSerializer
      ? await mdxSerializer(entry.body, { scope: entry.data })
      : null;

    return mdx;
  }
}

export const kjam = new ContentNext();
