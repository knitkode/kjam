import { normalisePathname, encodePathname } from "./index";

describe("normalisePathname", () => {
  it("normalises a malformed path", () => {
    expect(normalisePathname("/some//malformed/path///")).toEqual(
      "some/malformed/path"
    );
  });
});

describe("encodePathname", () => {
  it("normalises and encodes a malformed path", () => {
    expect(encodePathname("/!@some//malformed/path///")).toEqual(
      "!%40some/malformed/path"
    );
  });
});
