import { resolve } from "path";
import type { Entry } from "@kjam/core";
import { Serializer } from "./serializer";

const serializer = new Serializer({
  root: resolve(__dirname, "../../__mocks__"),
  api: {
    domain: "api.test",
    repo: "repo",
    branch: "branch",
    username: "username",
  },
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

    expect(mdPaths.length).toEqual(35);
  });

  // test("should run without errors...", async () => {
  //   const result = await serializer.run();

  //   expect(result).toHaveProperty("byRoute"); // FIXME: dummy, use snapshots...
  // });

  // this `slug` is wrong, let's normalise this mistake, the `i-progetti`
  // should not be declared here and automatically inferred by the parent folder markdown file
  test("should fixes frontmatter 'verbose' slugs", async () => {
    const result = await serializer.run();

    expect(result.byRoute["projects/project-title"]["it"].slug).toEqual(
      "titolo-progetto"
    );
  });

  test("should handle empty slug in entry frontmatter", async () => {
    const result = await serializer.run();
    const entry = result.byRoute["pages/home"]["en"];

    expect(entry.slug).toEqual("");
  });

  test("should handle relative links by route id", async () => {
    const result = await serializer.run();
    const entry = result.byRoute["pages/about"]["en"] as Entry<{
      link: string;
      link2: string;
    }>;

    expect(entry.data.link).toEqual("/events");

    expect(entry.data.link2).toEqual("[link](/events)");
  });

  test("should treat relative file links correctly", async () => {
    const result = await serializer.run();
    const entry = result.byRoute["pages/home"]["en"] as Entry<{
      attachment: string;
      attachment2: string;
      attachment3: string;
    }>;
    // /some/relative/file.pdf
    expect(entry.data.attachment).toEqual(
      "https://api.test/username/repo/branch/some/relative/file.pdf"
    );

    expect(entry.data.attachment2).toEqual(
      "https://api.test/username/repo/branch/pages/home/another/file.ogg"
    );

    expect(entry.data.attachment3).toEqual(
      "https://api.test/username/repo/branch/pages/third/file.mp3"
    );
  });
});
