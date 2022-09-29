import { resolve } from "path";
import { SerializerNext } from "./serializer-next";

const serializer = new SerializerNext({
  root: resolve(__dirname, "../../__mocks__"),
  // root: "ciao"
});

describe("Next Serializer", () => {
  test("should run without errors...", async () => {
    const result = await serializer.run();

    expect(result).toHaveProperty("byRoute"); // FIXME: dummy, use snapshots...
  });
});
