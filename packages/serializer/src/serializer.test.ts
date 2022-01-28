import { Serializer } from "./serializer";
import { resolve } from "path";

const serializer = new Serializer({
  root: resolve(__dirname, "../__mocks__"),
  // root: "ciao"
});

test("root should be configurable", () => {
  expect(serializer.root).toMatch(/\/packages\/serializer\/__mocks__$/);
});

test("it should find the i18n files and parse them", () => {
  expect(serializer.getI18n()).toEqual({
    locales: ["en", "it"],
    defaultLocale: "en",
    hideDefaultLocaleInUrl: true,
  });
});

test("it should find all the markdown files", async () => {
  const mdPaths = await serializer.getMarkdownPaths();

  expect(mdPaths.length).toEqual(12);
});

// jest.setTimeout(30000);
test("it should run correctly...", async () => {
  const result = await serializer.run();

  expect(result).toBeUndefined(); // FIXME: dummy, use snapshots...
});
