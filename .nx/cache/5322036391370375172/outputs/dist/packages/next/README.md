# @kjam/next

*Client* within the [**`kjam tooling`**](https://github.com/knitkode/kjam) for [git (github) based headless CMS](https://jamstack.org/headless-cms/) + [`next.js`](https://nextjs.org/) projects.

## Usage

In `kjam.js`

```js
module.exports = require("@kjam/next/config").withKjam({
  i18n: {
    locales: ["it", "en"],
    defaultLocale: "it",
  },
  // any Next.js and/or kjam configuration option
});
```

In `next.config.js`

```js
const withNx = require("@nrwl/next/plugins/with-nx");
const withTranslate = require("next-translate");

let nextConfig = require("./kjam").nextConfig;

nextConfig = withTranslate(nextConfig);
nextConfig = withNx(nextConfig);

module.exports = nextConfig;
```

In `i18n.js`

```js
module.exports = require("./kjam").translateConfig({
  // any next-translate configuration option
  pages: {
    '*': ['_', '~'],
  },
};

```

In one of your pages, e.g. `pages/[slug].ts`

```js
import { kjam, KjamProps } from "@kjam/next";
import { PageDebug } from "@kjam/next-ui";
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
  return await kjam.getStaticProps<Params, Data>(ctx, "");
};
```

> This repo is automatically deployed by [`@kjam`](https://github.com/knitkode/kjam) monorepo. Issues and development happen [there](https://github.com/knitkode/kjam).
