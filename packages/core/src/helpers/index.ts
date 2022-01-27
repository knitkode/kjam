/**
 * Normalise pathname
 *
 * From a path like `/some//malformed/path///` it returns `some/malformed/path`
 *
 * - Removes subsequent slashes
 * - Removing initial and ending slashes
 */
export function normalisePathname(pathname = "") {
  return pathname.replace(/\/+\//g, "/").replace(/^\/+(.*?)\/+$/, "$1");
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
