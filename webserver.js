#! /usr/bin/env node

const http = require("http");
// const staticAlias = require("node-static-alias");
// node-static-alias

const httpServer = http.createServer(handleRequest);
/* 
const fileServer = new staticAlias.Server(`${__dirname}\\web`, {
  cache: 100,
  serverInfo: "Node Server",
  alias: [
    {
      match: /(^\/(?:index)\/?)?(?:[?#].*$)?$/,
      serve: "index.html",
      force: true,
    },
  ],
}); */

main();
function main() {
  httpServer.listen("3000");
  console.log(`Listening in on https://localhost:3000`);
}

async function handleRequest(req, res) {
  // req.url can be used for path mathcing
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({"hello": "world"}));
  // fileServer.serve(reqStream, resSteram);
  // res.end("ehllo")
}
