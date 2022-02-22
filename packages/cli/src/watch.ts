import "dotenv/config";
import { join } from "path";
import { watch as chokidarWatch } from "chokidar";
import {
  SerializerNext,
  // } from "@kjam/serializer-next";
} from "../../serializer-next/src";

type WatchOptions = {
  root?: string;
};

export function watch(options: WatchOptions = {}) {
  const root =
    options.root || join(process.cwd(), process.env["KJAM_FOLDER"] || ".");
  console.log("SerializerNext", SerializerNext);
  const serializer = new SerializerNext({
    root,
    // api: {}
  });
  const glob = join(root, "**/*.{md,mdx,yml,yaml}");

  const watcher = chokidarWatch(glob, {
    ignored: /(^|[/\\])\../,
    persistent: true,
  });

  watcher
    // .on('add', path => log(`File ${path} has been added`))
    // .on('change', path => log(`File ${path} has been changed`))
    // .on('unlink', path => log(`File ${path} has been removed`))
    .on("change", async () => {
      await serializer.run();
    });

  // // More possible events.
  // watcher
  //   .on('addDir', path => log(`Directory ${path} has been added`))
  //   .on('unlinkDir', path => log(`Directory ${path} has been removed`))
  //   .on('error', error => log(`Watcher error: ${error}`))
  //   .on('ready', () => log('Initial scan complete. Ready for changes'))
  //   .on('raw', (event, path, details) => { // internal
  //     log('Raw event info:', event, path, details);
  //   });

  // // 'add', 'addDir' and 'change' events also receive stat() results as second
  // // argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
  // watcher.on('change', (path, stats) => {
  //   if (stats) console.log(`File ${path} changed size to ${stats.size}`);
  // });
}
