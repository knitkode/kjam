import { resolve } from "path";
import { Content } from "./content";

const kjam = new Content({
  api: {
    folder: resolve(__dirname, "../../../../__mocks__"),
  },
});

describe("Get homepage (special page)", () => {
  test("without `folder path` and 'home' `slug`", async () => {
    const entry = await kjam.get("home", "en");
    expect(entry).toHaveProperty("routeId", "home");
  });

  test("with 'pages' `folder path` and empty `slug`", async () => {
    const entry = await kjam.get("pages", "", "en");
    expect(entry).toHaveProperty("routeId", "home");
  });

  test("with empty `folder path` and 'home' '`slug`", async () => {
    const entry = await kjam.get("", "home", "en");
    expect(entry).toHaveProperty("routeId", "home");
  });

  test("with 'pages' `folder path` and 'home' `slug`", async () => {
    const entry = await kjam.get("pages", "home", "en");
    expect(entry).toHaveProperty("routeId", "home");
  });
});

describe("Return appropriate serializable response for empty content", () => {
  test("with only unexisting `slug`", async () => {
    const entry = await kjam.get("unexisting-slug", "en");
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
  test("without `folder path`", async () => {
    const entry = await kjam.get("events", "en");
    expect(entry).toHaveProperty("routeId", "events");
  });

  test("with empty `folder path`", async () => {
    const entry = await kjam.get("", "events", "en");
    expect(entry).toHaveProperty("routeId", "events");
  });

  test("with 'pages' `folder path`", async () => {
    const entry = await kjam.get("pages", "events", "en");
    expect(entry).toHaveProperty("routeId", "events");
  });
});

describe("Get second level content pages", () => {
  // test("without `folder path`", async () => {
  //   const entry = await kjam.get("spaces/indoor", "en");
  //   expect(entry).toHaveProperty("routeId", "spaces");
  // });

  // test("with `folder path` and empty `slug`", async () => {
  //   const entry = await kjam.get("", "spaces", "en");
  //   expect(entry).toHaveProperty("routeId", "spaces");
  // });

  test("with `folder path`, `slug` and default correct `locale`", async () => {
    const entry = await kjam.get("spaces/indoor", "the-kitchen", "en");
    expect(entry).toHaveProperty("slug", "the-kitchen");
  });

  test("with `folder path`, `slug` and other wrong `locale`", async () => {
    const entry = await kjam.get("spaces/indoor", "kitchen", "it");
    expect(entry).toBeNull();
  });

  test("with `folder path`, `slug` and other correct `locale`", async () => {
    const entry = await kjam.get("spaces/indoor", "cucina", "it");
    expect(entry).toHaveProperty("slug", "cucina");
  });

  test("with malformed `folder path`, `slug` and other correct `locale`", async () => {
    const entry = await kjam.get("/spaces/indoor//", "cucina", "it");
    expect(entry).toHaveProperty("slug", "cucina");
  });
});

describe("Get third level content pages", () => {
  // test("without `folder path`", async () => {
  //   const entry = await kjam.get("spaces/indoor", "en");
  //   expect(entry).toHaveProperty("templateSlug", "spaces");
  // });

  // test("with `folder path` and empty `slug`", async () => {
  //   const entry = await kjam.get("", "spaces", "en");
  //   expect(entry).toHaveProperty("templateSlug", "spaces");
  // });

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

describe("Images paths resolution", () => {
  const INPUT = () => ({
    entry: {
      dir: "collection/title",
      locale: "it",
      body: "test ![an-img-alt-text](./an-img.jpg)",
      excerpt: "",
      data: {
        template: "collection-single",
        slug: "/collezione/titolo",
        title: "A title",
        subtitle: "A subtitle",
        cover: {
          image: "./cover.jpg",
        },
        gallery: {
          items: [
            {
              image: "./photos/name.jpg",
              alt: "",
            },
          ],
        },
      },
      routeId: "collection/title",
      slug: "/collezione/title",
      templateSlug: "collection/title",
    },
  });

  const OUTPUT = () => ({
    entry: {
      body: `test <Img src="https://raw.githubusercontent.com/username/repo/branch/collection/title/an-img.jpg" alt="an-img-alt-text" width={0} height={0} />`,
      data: {
        ...INPUT().entry.data,
        cover: {
          image:
            "https://raw.githubusercontent.com/username/repo/branch/collection/title/cover.jpg",
        },
        gallery: {
          items: [
            {
              image:
                "https://raw.githubusercontent.com/username/repo/branch/collection/title/photos/name.jpg",
              alt: "",
            },
          ],
        },
      },
    },
  });

  const content = new Content({
    api: {
      username: "username",
      repo: "repo",
      branch: "branch",
    },
  });

  // same as the below one
  // test("treatBody", async () => {
  //   const body = await content.treatBody(INPUT().entry);

  //   expect(body).toEqual(OUTPUT().entry.body);
  // });

  test("treatBodyImages", async () => {
    const body = await content.treatBodyImages(INPUT().entry);

    expect(body).toEqual(OUTPUT().entry.body);
  });

  test("treatDataImages", async () => {
    const entry = await content.treatDataImages(INPUT().entry);

    expect(entry).toEqual({
      ...INPUT().entry,
      data: {
        ...OUTPUT().entry.data,
      },
    });
  });

  test("treatAllImages", async () => {
    const entry = await content.treatAllImages(INPUT().entry);

    expect(entry).toEqual({
      ...INPUT().entry,
      body: OUTPUT().entry.body,
      data: {
        ...OUTPUT().entry.data,
      },
    });
  });
});
