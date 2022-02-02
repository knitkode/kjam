import { resolve } from "path";
import { Serializer } from "./serializer";

const serializer = new Serializer({
  root: resolve(__dirname, "../../../__mocks__"),
  // root: "ciao"
});

describe("Serializer", () => {
  test("root should be configurable", () => {
    expect(serializer.root).toMatch(/\/kjam\/__mocks__$/);
  });

  test("should find and parse the i18n files", () => {
    expect(serializer.getI18n()).toEqual({
      locales: ["en", "it"],
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
    });
  });

  test("should find all the markdown files", async () => {
    const mdPaths = await serializer.getMarkdownPaths();

    expect(mdPaths.length).toEqual(32);
  });

  // test("should run without errors...", async () => {
  //   const result = await serializer.run();

  //   expect(result).toHaveProperty("byRoute"); // FIXME: dummy, use snapshots...
  // });

  // this `slug` is wrong, let's normalise this mistake, the `i-progetti`
  // should not be declared here and automatically inferred by the parent folder markdown file
  test("should fixes frontmatter 'verbose' slugs", async () => {
    const result = await serializer.run();

    expect(result.byRoute["projects/project-title"]["it"]["data"].slug).toEqual(
      "titolo-progetto"
    );
  });
});
