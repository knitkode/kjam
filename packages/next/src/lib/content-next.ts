import type {
  GetStaticPropsContext,
  GetStaticPropsResult,
  GetStaticPathsContext,
  GetStaticPathsResult,
} from "next";
import type { serialize } from "next-mdx-remote/serialize";
import type { Entry } from "@kjam/core";
import { Content, normalisePathname } from "@kjam/core";
import type { ConfigNextOptions } from "./config-next";
import type { KjamProps } from "../index";

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

export type ContentNextConfig = ConfigNextOptions & {};

abstract class ContentNext extends Content {
  /**
   * @param context Unused for now
   * @param fallback Defaults to `"blocking"`
   * @param routeType Defaults to `""`
   * @param asString Defaults to `false`
   * @returns
   */
  static async getStaticPaths<
    Params extends StaticPathsParams = StaticPathsParams,
    Type extends StaticPathsType = boolean
  >(
    context: GetStaticPathsContext,
    fallback: GetStaticPathsResult["fallback"] = "blocking",
    routeType: string = "",
    asString?: Type
  ) {
    // const { locales, defaultLocale } = context;
    const { byRoute } = await Content.api.getMaps();
    const paths: GetStaticPathsResult<Params>["paths"] = [];

    // FIXME:
    // routeType = routeType === "pages" ? "" : "";

    for (const [routeId, routeLocales] of Object.entries(byRoute)) {
      if (routeId.startsWith(routeType)) {
        for (const [routeLocale, route] of Object.entries(routeLocales)) {
          let slug;

          if (asString) {
            slug = route.templateSlug as StaticPathSlug<true>;
          } else {
            slug = route.templateSlug.split("/") as StaticPathSlug<false>;
          }

          if (slug) {
            paths.push({
              // @ts-expect-error
              params: { slug },
              locale: routeLocale,
            });
            // console.log(
            //   `content::getStaticPaths routeType ${routeType}, slug: ${slug}`
            // );
          }
        }
      }
    }
    // console.log("git::getStaticPaths", paths);
    return {
      fallback,
      paths,
    };
  }

  static async getByRoute<T>(routeId: string, locale?: string) {
    const { byRoute } = await Content.api.getMaps<T>();

    if (locale && byRoute[routeId]?.[locale]) {
      return byRoute[routeId]?.[locale];
    }

    return null;
  }

  static async get<T>(
    folderPath: string = "",
    slug: string | string[] = "",
    locale: string = ""
  ) {
    let templateSlug = Array.isArray(slug) ? slug.join("/") : slug;
    // templateSlug = normalisePathname(`${localisedFolderPath}/${slug}`);
    templateSlug = normalisePathname(`${folderPath}/${slug}`);

    console.log(
      `kjam/content::get folderPath: ${folderPath}, templateSlug: ${templateSlug}`
    );

    if (!templateSlug) return null;

    const { byTemplateSlug } = await Content.api.getMaps<T>();
    return byTemplateSlug[templateSlug]?.[locale];
  }

  static async getStaticProps<
    Params extends StaticPathsParams = StaticPathsParams,
    Data extends {} = {}
    // ExtraData extends Record<string, any> = {}
  >(
    ctx: GetStaticPropsContext<Params>,
    mdxSerializer: typeof serialize,
    routeType: string = "",
    additionalData = {}
  ): Promise<GetStaticPropsResult<KjamProps<Data, Params>>> {
    const { params, locale } = ctx;
    const entry = await this.get<Data>(routeType, params?.slug, locale);

    if (!entry) {
      return {
        notFound: true,
      };
    }

    const body = await Content.treatBody<Data>(entry);
    // const mdx = { compiledSource: body, scope: entry.data }; //
    const mdx = await mdxSerializer(body, { scope: entry.data });
    return { props: { mdx, entry, ...additionalData } };
  }

  static async getEntryMdx<T>(
    entry: Entry<T>,
    mdxSerializer?: typeof serialize
  ) {
    const body = await Content.treatBody(entry);
    const mdx = mdxSerializer
      ? await mdxSerializer(body, { scope: entry.data })
      : undefined;

    return mdx;
  }

  /**
   * @deprecated
   */
  // async getPaths<T>() {
  //   const { byRoute } = await Content.api.getMaps<T>();
  //   const paths = [];

  //   for (const [_routeId, routeLocales] of Object.entries(byRoute)) {
  //     for (const [routeLocale, route] of Object.entries(routeLocales)) {
  //       const slug = route.slug.replace(/^\//, '').split('/');

  //       if (slug) {
  //         paths.push({
  //           params: { slug },
  //           locale: routeLocale,
  //         });
  //       }
  //     }
  //   }

  //   return paths;
  // }
}

export const kjam = ContentNext;
