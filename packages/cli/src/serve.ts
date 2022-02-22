import type { IncomingMessage, ServerResponse } from "http";
import { createServer } from "http";
import getPort from "get-port";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const handler = require("serve-handler");
// import handler from "serve-handler"

const registerShutdown = (fn: () => void) => {
  let run = false;

  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };

  process.on("SIGINT", wrapper);
  process.on("SIGTERM", wrapper);
  process.on("exit", wrapper);
};

/**
 * @see https://github.com/vercel/serve/blob/main/bin/serve.js
 */
export async function serve(rootPath: string, _port?: number) {
  const port = _port || (await getPort());

  return new Promise<string>((resolve) => {
    const serverHandler = async (
      request: IncomingMessage,
      response: ServerResponse
    ) => {
      response.setHeader("Access-Control-Allow-Origin", "*");
      return handler(request, response, {
        public: rootPath,
      });
    };

    const server = createServer(serverHandler);

    server.on("error", (err) => {
      if (err.name === "EADDRINUSE") {
        serve(rootPath, port + 1);
        return;
      }
      console.error(console.error(`Failed to serve: ${err.stack}`));
      process.exit(1);
    });

    server.listen(port, async () => {
      registerShutdown(() => server.close());

      const details = server.address();
      let url = "";

      if (typeof details === "string") {
        url = details;
      } else if (typeof details === "object" && details?.port) {
        const address =
          details.address === "::" ? "localhost" : details.address;

        url = `http://${address}:${details.port}`;
      }

      // console.log(`path is ${rootPath}, url is ${url}`);

      resolve(url);
    });
  });
}
