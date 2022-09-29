import { resolve } from "path";
import { ContentNext } from "./content";

const kjam = new ContentNext({
  api: {
    folder: resolve(__dirname, "../../__mocks__"),
  },
});


describe("Get homepage (special page)", () => {
  test("with 'pages' `folder path` and 'home' `slug`", async () => {
    const entry = await kjam.get("pages", "home", "en");
    expect(entry).toHaveProperty("id", "pages/home");
  });
});

describe("Return appropriate serializable response for empty content", () => {
  test("with only unexisting `folder path`", async () => {
    const entry = await kjam.get("unexisting-folder-path", "en");
    expect(entry).toBeNull();
  });

  test("with existing `folder path` and unexisting `slug`", async () => {
    const entry = await kjam.get("pages", "unexisting-slug", "en");
    expect(entry).toBeNull();
  });

  test("with unexisting `folder path` and existing '`slug`", async () => {
    const entry = await kjam.get("unexisting-folder", "home", "en");
    expect(entry).toBeNull();
  });
});

describe("Get first level content pages", () => {
  test("with 'pages' `folder path` and `slug`", async () => {
    const entry = await kjam.get("pages", "events", "en");
    expect(entry).toHaveProperty("id", "pages/events");
  });
});

describe("Get second level content pages", () => {
  test("with `folder path` and without `slug`", async () => {
    const entry = await kjam.get("spaces/outdoor", "it");
    expect(entry).toHaveProperty("slug", "all-aperto");
  });

  test("with `folder path`, `slug` and default correct `locale`", async () => {
    const entry = await kjam.get("spaces/indoor", "the-kitchen", "en");
    expect(entry).toHaveProperty("slug", "the-kitchen");
  });

  test("with `folder path`, `slug` and wrong `locale`", async () => {
    const entry = await kjam.get("events", "another-event", "it");
    expect(entry).toBeNull();
  });

  test("with `folder path`, `slug` and correct `locale`", async () => {
    const entry = await kjam.get("spaces/indoor", "cucina", "it");
    expect(entry).toHaveProperty("slug", "cucina");
  });

  test("with malformed `folder path`, `slug` and correct `locale`", async () => {
    const entry = await kjam.get("/spaces/indoor//", "cucina", "it");
    expect(entry).toHaveProperty("slug", "cucina");
  });
});

describe("Get third level content pages", () => {
  test("with `folder path`, `slug` and default correct `locale`", async () => {
    const entry = await kjam.get("spaces/outdoor/by-season", "summer", "en");
    expect(entry).toHaveProperty("slug", "summer");
  });

  test("with `folder path`, `slug` and default correct `locale` inferring the slug from folder name", async () => {
    const entry = await kjam.get("spaces/outdoor/by-season", "winter", "en");
    expect(entry).toHaveProperty("slug", "winter");
  });

  test("with `folder path`, `slug` and other wrong `locale`", async () => {
    const entry = await kjam.get("spaces/outdoor/by-season", "inverno", "en");
    expect(entry).toBeNull();
  });

  test("with `folder path`, `slug` and other correct `locale`", async () => {
    const entry = await kjam.get("spaces/outdoor/by-season", "inverno", "it");
    expect(entry).toHaveProperty("slug", "inverno");
  });

  test("with malformed `folder path`, `slug` and other correct `locale`", async () => {
    const entry = await kjam.get(
      "/spaces/outdoor/by-season//",
      "inverno",
      "it"
    );
    expect(entry).toHaveProperty("slug", "inverno");
  });

  test("translates the full slug of a nested entry", async () => {
    const entry = await kjam.get("spaces/outdoor/by-season", "inverno", "it");
    expect(entry).toHaveProperty("url", "/spazi/all-aperto/stagioni/inverno");
  });
});

describe("get static paths", () => {
  test("one level deep collections", async () => {
    const staticPaths = await kjam.getStaticPaths(
      { locales: ["en", "it"] },
      "blocking",
      "projects"
    );
    // console.log("staticPaths", staticPaths.paths.map(paths =>JSON.stringify(paths)));
    expect(staticPaths.paths.length).toEqual(2);
  });

  test("one level deep collections (pages)", async () => {
    const staticPaths = await kjam.getStaticPaths(
      { locales: ["en"] },
      "blocking",
      "pages"
    );

    // console.log("staticPaths", staticPaths.paths.map(paths =>JSON.stringify(paths)));
    expect(staticPaths.paths.length).toEqual(3);
    
    // check that we do not have empty static paths
    staticPaths.paths.forEach(path => {
      if (typeof path !== "string") {
        expect(path.params.slug.length).toBeGreaterThan(0);
      } else {
        expect(path).not.toStrictEqual("");
      }
    })
  });

  test("two level deep collections", async () => {
    const staticPaths = await kjam.getStaticPaths(
      { locales: ["en", "it"] },
      "blocking",
      "spaces/indoor"
    );
    // console.log("staticPaths", staticPaths.paths.map(paths =>JSON.stringify(paths)));
    expect(staticPaths.paths.length).toEqual(4);
  });

  test("finds all entries of a multilevel collection", async () => {
    const staticPaths = await kjam.getStaticPaths(
      { locales: ["en", "it"] },
      "blocking",
      "spaces"
    );
    expect(staticPaths.paths.length).toEqual(18);
  });

  test("finds just the first level of entries of a multilevel collection when asked to treat the slug as a simple string", async () => {
    const staticPaths = await kjam.getStaticPaths(
      { locales: ["en", "it"] },
      undefined,
      "spaces",
      true
    );
    expect(staticPaths.paths.length).toEqual(2);
  });

  test("respect missing entries per locale", async () => {
    const staticPaths = await kjam.getStaticPaths(
      { locales: ["en", "it"] },
      "blocking",
      "events"
    );
    // `another-event` does not have the `it` translation, so 3 instead of 4
    expect(staticPaths.paths.length).toEqual(3);
  });

  test("respect context locales", async () => {
    const staticPaths = await kjam.getStaticPaths(
      { locales: ["it"] },
      "blocking",
      "events"
    );
    // `another-event` does not have the `it` translation, so 3 instead of 4
    expect(staticPaths.paths.length).toEqual(1);
  });
});

describe("get static props", () => {
  test("one level deep dynamic page", async () => {
    const ctx = { locale: "en", params: { slug: "about-us" } };
    const { params, locale } = ctx;
    const entry = await kjam.get("pages", params?.slug || "", locale);

    expect(entry).toHaveProperty("data");
    // const result = await kjam.getStaticProps(ctx);
    // // console.log("staticPaths", staticPaths.paths.map(paths =>JSON.stringify(paths)));
    // expect(result).toHaveProperty("props");
  });
});
