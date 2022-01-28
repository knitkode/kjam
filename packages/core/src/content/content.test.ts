import { Content } from "./index";

const CONTENT_CONFIG = {
  api: {
    username: "username",
    repo: "repo",
    branch: "branch",
  },
};

const INPUT = () => ({
  entry: {
    dir: "collection/title",
    parentDirs: "collection",
    filename: "index.it.md",
    basename: "index.it",
    ext: "md",
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

// same as the below one
// test("treatBody", async () => {
//   const content = new Content(CONTENT_CONFIG);
//   const body = await content.treatBody(INPUT().entry);

//   expect(body).toEqual(OUTPUT().entry.body);
// });

test("treatBodyImages", async () => {
  const content = new Content(CONTENT_CONFIG);
  const body = await content.treatBodyImages(INPUT().entry);

  expect(body).toEqual(OUTPUT().entry.body);
});

test("treatDataImages", async () => {
  const content = new Content(CONTENT_CONFIG);
  const entry = await content.treatDataImages(INPUT().entry);

  expect(entry).toEqual({
    ...INPUT().entry,
    data: {
      ...OUTPUT().entry.data,
    },
  });
});

test("treatAllImages", async () => {
  const content = new Content(CONTENT_CONFIG);
  const entry = await content.treatAllImages(INPUT().entry);

  expect(entry).toEqual({
    ...INPUT().entry,
    body: OUTPUT().entry.body,
    data: {
      ...OUTPUT().entry.data,
    },
  });
});
