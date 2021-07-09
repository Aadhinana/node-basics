const fetch = require("node-fetch");

async function main() {
  let res = await fetch("http://127.0.0.1:3000");
  /* Dont' know why https does not work with node-fetch hence used http */
  if (res && res.ok) {
    // console.log("All good. Received JSON data successfully.");
    process.exitCode = 0;
    return;
  } else {
    process.exitCode = 1;
  }
}

main().catch(console.log);
