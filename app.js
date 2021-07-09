#! /usr/bin/env node

const childProc = require("child_process");

async function main() {
  let child = childProc.spawn("node", ["child.js"]);
  child.on("exit", (code) => {
    console.log(`Finished executing, ${code}`);
  });
}

main().catch(console.log);
