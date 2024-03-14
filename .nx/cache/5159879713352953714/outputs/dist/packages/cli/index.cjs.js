'use strict';

var commander = require('commander');
var path = require('path');
var chokidar = require('chokidar');
var serializerNext = require('@kjam/serializer-next');
var http = require('http');

// import getPort from "get-port";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const handler = require("serve-handler");
// import handler from "serve-handler"
const registerShutdown = (fn) => {
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
async function serve(rootPath, _port) {
    // const port = _port || (await getPort());
    const port = 3000;
    const handler = (() => void 0);
    return new Promise((resolve) => {
        const serverHandler = async (request, response) => {
            response.setHeader("Access-Control-Allow-Origin", "*");
            return handler();
        };
        const server = http.createServer(serverHandler);
        server.on("error", (err) => {
            if (err.name === "EADDRINUSE") {
                serve();
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
            }
            else if (typeof details === "object" && details?.port) {
                const address = details.address === "::" ? "localhost" : details.address;
                url = `http://${address}:${details.port}`;
            }
            // console.log(`path is ${rootPath}, url is ${url}`);
            resolve(url);
        });
    });
}

// import "dotenv/config";
/**
 * @see https://github.com/paulmillr/chokidar
 */
async function watch(opts = {}) {
    const root = opts.root || path.join(process.cwd(), process.env["KJAM_FOLDER"] || ".");
    const url = await serve();
    const serializer = new serializerNext.SerializerNext({
        root,
        api: {
            url,
        },
    });
    await serializer.run();
    const globToWatch = path.join(root, "**/*.{md,mdx,yml,yaml}");
    const watcher = chokidar.watch(globToWatch, {
        ignored: /(^|[/\\])\../,
        persistent: true,
    });
    watcher.on("change", async () => {
        await serializer.run();
    });
}

// #! /usr/bin/env node
const program = new commander.Command();
program.name("kjam").description("CLI to use kjam").version("0.0.1");
program
    .command("watch")
    .description("Watch your local content repo")
    .action(watch);
program.parse();
