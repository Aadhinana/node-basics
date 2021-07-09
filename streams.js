#! /usr/bin/env node

// "use-strict"; -> remoced for esm modules

const path = require("path");
const fs = require("fs");
const util = require("util");
const Trasnform = require("stream").Transform;
const zlib = require("zlib");
// const getStdin = require("get-stdin");

// The options mean. If any arg for file treat it as a string, If any arg for help/ in treat it as a bool value
let args = require("minimist")(process.argv.slice(2), {
  string: ["file"],
  boolean: ["help", "in"],
});

let BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

if (args.help) {
  help();
} else if (args.in || args._.includes("-")) {
  // Reading streams in directly
  processFile(stream);
} else if (args.file) {
  // Take the input from file as  a stream directly.
  let stream = fs.createReadStream(args.file);
  processFile(stream);
} else {
  error("Incorrect usage!", true);
}

function processFile(inStream) {
  // Working with streams
  let outStream = inStream;

  upStream = new Trasnform({
    // Do transformation stuff to the streams
    transform(chunk, encoding, next) {
      // converting it to upper case here
      this.push(chunk.toString().toUpperCase());
      // calling the next kinda middleware
      next();
    },
  });

  outStream = outStream.pipe(upStream);

  let zipStream = zlib.createGzip();
  outStream = outStream.pipe(zipStream);

  outStream.pipe(fs.WriteStream(path.join(BASE_PATH, "out.txt.gz")));
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
