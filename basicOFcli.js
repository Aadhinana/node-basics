#! /usr/bin/env node

// "use-strict"; -> remoced for esm modules

const path = require("path");
const fs = require("fs");
const util = require("util");
const getStdin = require("get-stdin");

// The options mean. If any arg for file treat it as a string, If any arg for help/ in treat it as a bool value
let args = require("minimist")(process.argv.slice(2), {
  string: ["file"],
  boolean: ["help", "in"],
});

let BASE_PATH = path.resolve(process.env.BASE_PATH) || __dirname;

if (args.help) {
  help();
} else if (args.in || args._.includes("-")) {
  // getStdin will read from the stdin input and pass it directly to the fn here
  getStdin().then(processFile).catch(error);
} else if (args.file) {
  fs.readFile(path.join(BASE_PATH, args.file), (err, content) => {
    if (err) {
      error(err.toString());
      return;
    }
    processFile(content);
  });
} else {
  error("Incorrect usage!", true);
}

function processFile(content) {
  content = content.toString().toUpperCase();
  console.log(content);
  process.stdout.write(content);
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    help();
  }
}

// More like a function that specifies what can be doen with this script
function help() {
  console.log("EVEN IDK WHAT's GOING ON. TELL ME ABOUT IT. WILL FILL IT SOON");
  console.log("--file <file path goes here!>");
}
