import "dotenv/config";
import { existsSync } from "fs";

/**
 * @see https://github.com/Pig-Cola/next-js-init-function
 */
export async function dev() {
  const isNext = existsSync("./node_modules/next/dist/bin/next");
  let isCommandToRunBeforeExecuted = false;

  console.log("prepare custom kjam `dev` command?");

  if (isNext) {
    require("./node_modules/next/dist/bin/next");
    isCommandToRunBeforeExecuted = true;
  }

  if (isCommandToRunBeforeExecuted) {
    isCommandToRunBeforeReady(afterCommandToRunBeforeIsReady);
  }

  function isCommandToRunBeforeReady(fn: () => any) {
    setTimeout(() => {
      if (!("KJAM_FOLDER" in process.env)) {
        setTimeout(isCommandToRunBeforeReady, 0, fn);
        return;
      }
      fn();
    }, 50);
  }

  function afterCommandToRunBeforeIsReady() {
    console.log("run custom kjam `dev` command?");
  }
}
