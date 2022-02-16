import { resolve } from "path";
import { ContentNext } from "./content";

const kjam = new ContentNext({
  api: {
    folder: resolve(__dirname, "../../__mocks__"),
  },
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
    expect(staticPaths.paths.length).toEqual(4);
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
