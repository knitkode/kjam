import "dotenv/config";
import { join } from "path";
import { watch as chokidarWatch } from "chokidar";
import {
  SerializerNext,
  // } from "@kjam/serializer-next";
} from "../../serializer-next/src";
import { serve } from "./serve";

type WatchOptions = {
  root?: string;
};

/**
 * @see https://github.com/paulmillr/chokidar
 */
export async function watch(opts: WatchOptions = {}) {
  const root =
    opts.root || join(process.cwd(), process.env["KJAM_FOLDER"] || ".");
  const url = await serve(root);

  const serializer = new SerializerNext({
    root,
    api: {
      url,
    },
  });

  await serializer.run();

  const globToWatch = join(root, "**/*.{md,mdx,yml,yaml}");
  const watcher = chokidarWatch(globToWatch, {
    ignored: /(^|[/\\])\../,
    persistent: true,
  });

  watcher.on("change", async () => {
    await serializer.run();
  });
}
