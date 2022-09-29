import { resolve } from "path";
import { Content } from "./content";

const kjam = new Content({
  api: {
    folder: resolve(__dirname, "../../__mocks__"),
  },
});

describe("Get homepage (special page)", () => {
  // test("without `folder path` and 'home' `slug`", async () => {
  //   const entry = await kjam.get("home", "en");
  //   expect(entry).toHaveProperty("id", "pages/home");
  // });
});

describe("Get many in collection", () => {
  test("translates the full slug of a nested entry", async () => {
    const entries = await kjam.getMany("events", "en");
    expect(entries).toHaveLength(2);
  });
});

// FIXME: this has moved to the serializer...move the tests too
// describe("Images paths resolution", () => {
//   const INPUT = () => ({
//     entry: {
//       dir: "collection/title",
//       locale: "it",
//       body: "test ![an-img-alt-text](./an-img.jpg)",
//       excerpt: "",
//       data: {
//         template: "collection-single",
//         slug: "/collezione/titolo",
//         title: "A title",
//         subtitle: "A subtitle",
//         cover: {
//           image: "./cover.jpg",
//         },
//         gallery: {
//           items: [
//             {
//               image: "./photos/name.jpg",
//               alt: "",
//             },
//           ],
//         },
//       },
//       id: "collection/title",
//       slug: "/collezione/title",
//       templateSlug: "collection/title",
//     },
//   });

//   const OUTPUT = () => ({
//     entry: {
//       body: `test <Img src="https://raw.githubusercontent.com/username/repo/branch/collection/title/an-img.jpg" alt="an-img-alt-text" width={0} height={0} />`,
//       data: {
//         ...INPUT().entry.data,
//         cover: {
//           image:
//             "https://raw.githubusercontent.com/username/repo/branch/collection/title/cover.jpg",
//         },
//         gallery: {
//           items: [
//             {
//               image:
//                 "https://raw.githubusercontent.com/username/repo/branch/collection/title/photos/name.jpg",
//               alt: "",
//             },
//           ],
//         },
//       },
//     },
//   });

//   const content = new Content({
//     api: {
//       username: "username",
//       repo: "repo",
//       branch: "branch",
//     },
//   });

//   // same as the below one
//   // test("treatBody", async () => {
//   //   const body = await content.treatBody(INPUT().entry);

//   //   expect(body).toEqual(OUTPUT().entry.body);
//   // });

//   test("treatBodyImages", async () => {
//     const body = await content.treatBodyImages(INPUT().entry);

//     expect(body).toEqual(OUTPUT().entry.body);
//   });

//   test("treatDataImages", async () => {
//     const entry = await content.treatDataImages(INPUT().entry);

//     expect(entry).toEqual({
//       ...INPUT().entry,
//       data: {
//         ...OUTPUT().entry.data,
//       },
//     });
//   });

//   test("treatAllImages", async () => {
//     const entry = await content.treatAllImages(INPUT().entry);

//     expect(entry).toEqual({
//       ...INPUT().entry,
//       body: OUTPUT().entry.body,
//       data: {
//         ...OUTPUT().entry.data,
//       },
//     });
//   });
// });
