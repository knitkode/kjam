import { normalisePathname, encodePathname } from "./helpers";

describe("normalisePathname", () => {
  it("normalises a complex malformed path", () => {
    expect(normalisePathname("/some//malformed/path///")).toEqual(
      "some/malformed/path"
    );
  });

  it("normalises a simple path with initial slash", () => {
    expect(normalisePathname("/some")).toEqual("some");
  });

  it("normalises a simple path with ending slash", () => {
    expect(normalisePathname("some/")).toEqual("some");
  });

  it("leave a path without slashes as it is", () => {
    expect(normalisePathname("some")).toEqual("some");
  });

  it("normalises a simple path with many initial and ending slashes", () => {
    expect(normalisePathname("///some///")).toEqual("some");
  });
});

describe("encodePathname", () => {
  it("normalises and encodes a malformed path", () => {
    expect(encodePathname("/!@some//malformed/path///")).toEqual(
      "!%40some/malformed/path"
    );
  });
});
