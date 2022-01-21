# @kjam/next

*Client* within the [**`kjam tooling`**](https://github.com/knitkode/kjam) for [git (github) based headless CMS](https://jamstack.org/headless-cms/) + [`next.js`](https://nextjs.org/) projects.

## Usage

In `next.config.mjs`

```js
import { config } from "@kjam/next";

const kjam = config({
  i18n: {
    locales: ["en", "it"],
    defaultLocale: "it",
    localeDetection: false,
  },
});

module.exports = {
  ...kjam.base(), // optionally...
  async redirects() {
    return [...await kjam.getRedirects()];
  },
  async rewrites() {
    return [...await kjam.getRewrites()];
  },
};
```

In one of your pages, e.g. `pages/[slug].ts`

```js
import { kjam, KjamProps } from "@kjam/next";
import { PageDebug } from "@kjam/next-ui";
import { serialize } from "next-mdx-remote/serialize";
// import { mdComponents } from "../md-components";

type Data = {
  title: string;
};

type Params = {
  slug: string[];
};

type Props = KjamProps<Data, Params> & {};

export default function PagesPage({
  mdx,
  entry,
}: PageStatic<typeof getStaticProps>) {
  return (
    <PageDebug
      tpl="[slug]"
      entry={entry}
      mdx={mdx}
      // mdComponents={mdComponents}
    />
  );
}

export const getStaticPaths: DataStaticPaths<Params> = async (ctx) => {
  return await kjam.getStaticPaths<Params>(ctx, "blocking", "pages");
};

export const getStaticProps: DataStatic<Props, Params> = async (ctx) => {
  return await kjam.getStaticProps<Params, Data>(ctx, serialize, "");
};
```

> This repo is automatically deployed by [`@kjam`](https://github.com/knitkode/kjam) monorepo. Issues and development happen [there](https://github.com/knitkode/kjam).
