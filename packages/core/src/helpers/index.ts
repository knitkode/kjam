/**
 * Normalise pathname
 *
 * From a path like `/some//malformed/path///` it returns `some/malformed/path`
 *
 * - Removes subsequent slashes
 * - Removing initial and ending slashes
 */
export function normalisePathname(pathname = "") {
  return pathname.replace(/\/+\//g, "/").replace(/^\/*(.*?)\/*$/, "$1");
}

/**
 * Clean a pathname and encode each part
 *
 * @see {@link normalisePathname}
 */
export function encodePathname(pathname: string) {
  const parts = normalisePathname(pathname).split("/");

  return parts
    .filter((part) => !!part)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

/**
 * Detect if we are running a test
 *
 * @see https://stackoverflow.com/q/50940640/9122820
 */
export function isTestEnv() {
  return (
    process.env["JEST_WORKER_ID"] !== undefined ||
    process.env["NODE_ENV"] === "test"
  );
}
