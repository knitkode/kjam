/**
 * @file
 *
 * Shamelessly copied from [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote/blob/main/src/index.tsx)
 * We do this because of esm vs commonjs import problems
 */

if (typeof window !== "undefined") {
  window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
      var start = Date.now();
      return setTimeout(function () {
        cb({
          didTimeout: false,
          timeRemaining: function () {
            return Math.max(0, 50 - (Date.now() - start));
          },
        });
      }, 1);
    };

  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id) {
      clearTimeout(id);
    };
}
