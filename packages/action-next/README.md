# kjam-action-next

*Github action* within the [**`kjam tooling`**](https://github.com/knitkode/kjam) for [git (github) based headless CMS](https://jamstack.org/headless-cms/) + [`next.js`](https://nextjs.org/) projects.

## Usage

In `.github/workflows/main.yml`

```yml
name: CI
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: knitkode/kjam-action-next@v1
```

> This repo is automatically deployed by [`@kjam`](https://github.com/knitkode/kjam) monorepo. Issues and development happen [there](https://github.com/knitkode/kjam).
