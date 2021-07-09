Bridging the gap between the server and the browser.

"MiddleEnd" that deals with all the stuff. You give it something to a blackbox. Some API you talk to.

Node is not server side JS. Written in Ruby first. 
=> High throughput, low Latency IO tasks -> Micro server architecture
Event loop semantic built in JS. So he rewrote it to JS.

IO tasks are much slower than CPU tasks. 

POSIX like interface used for API for Node.

JS is agnostic to IO. Console.log is not in the spec of JS.

Writing to the stream directly. This is much faster to do.
process.stdout.write("fasdf")

console.log() is a wrappper around the above and does extra stuff.

stdout, stderr, stdin
stdin -> very hard to handle. Will use a package to handle this across platforms.

env a program that you give a program and it finds it for you
thats why we use 
`#! /usr/bin/env node` to start off with
chmod to change permission and ./app.js and it will run now.

- Have some helper output to tell you have the script works.

process.argv that gets all the arguments that's passed on to the file

minimist -> handles parsing this args.

`let args = require("minimist")(process.argv.slice(2))`
`args` has all the parsed arguments now.

`path.resolve` take a file path and handle ./ ../ also inside it. 

`__dirname` => gives the dir of the currently executing file

`fs.readFileSync` takes a file path and then it returns a buffer.
< Buffer sdfsdaf  fsad fsd>
But process.stdout.write() will give it properly.

console.log turns it into the string before sending it to the stdout.

readfileSync will take a second arg for encoding and this problem does not come.

```js
readFile(filePath, (err,content) => { 
	if(err) // log error
	// do stuff with content
})
```

err,callback is a very common pattern in nodejs.

`content.toString().toUpperCase()` this is inefficient as it pulls the whole stream into memory and then converts it into a string then makes it into uppercase. `streams` are much better use case as that would scale very well here.

`get-stdin` package to wrap around stdin for better stuff.

 getStdin().then(content => {} ).catch(err => {} );
 
 cat trial.txt | ./app.js --in
 This will take the input from the file and pipe it into our script.
 
 `HELLO=WORLD ./app.js` 
 This causes the env variable to be set on a per command basis where process.env.HELLO is set to WORLD for this once.
 
 ---
 
 Streams
 
 [Node Streams Handbook](https://github.com/substack/stream-handbook)
 
 readable and writable streams -> simplex streams
 duplex streams are the other kind.
 
 connect both streams. connect a pipe (of readable stream) to something (a writable stream).
 
 `stream3 = stream1.pipe(stream2)`
Can read that stream again as stream3
 
 `pipe()` part of the readable stream as it makes sense that way.
 `unpipe()` is like the opposite of this stuff. More like a `removeEventListner` types
 
 Streams are mostly figuring out what to read from and what to write it to and a sseries of this to get your desired output as required.
 
 -> Instead of reading the whole say 1MB of file into memory we now read it in chunks as dump it to outstream. Much more efficient way of working.
 
 `fs.createReadStream(path)` will return a stream from a file in the given path.
 
 Transform stream to pull of transforms
 
 ```js
 const Transform = require("streams").Transform
 
 // say instream of some input
 
 let v = new Transform({
 	trasnform(chunk, encoding, next){
		// DO stuff to your instream in here
		// procesesd in chunks, next is called like a middleware
		// pushed into an array after doing stuff to stream
		this.push(chunk.toString().toUpperCase());
		next();
	}
 })
 ```
 
 `fs.createWriteStream(pathOfFile)` to write stream directly into another file.
 
 Another use case is to unzip files -> process them -> rezip them
 
 `zlib` from node
 
 ```js
 let zipstream = zlib.createGzip();
 otustream = outsream.pipe(zipstream);
 // Write this zipped stream to a file using stream
 outstream.pipe(fs.createWriteStream(path))
 ```
 
 `zlib.creatGunzip()` to unzip any incoming zipped stream.
 
 ALL STREAM OPERATIONS ARE ASYNC. 
 
 ```js
 stream.on("end", fucntion(){
 	// do stuff here after the stream ends
 })
 ```
 
 ---
 
 Database
 
 `sqlite3` -> Does not require sql server. Flat binary file format like database.
 
 ---
 
 Web Servers
 
```js
const http = require("http)"

const server = http.createServer(handleReq);

server.listen(PORT);

function handleRequest(req,res){
	// do stuff
	// listen to req.url, req.method to swtich routes
	res.writeHead(200, {"Content-Type": "plain/text"})
	res.end("Hello world!");
}
```

`res` and `req` in handleReuest are both streams too.

=> Now we can just read a file stream from file and write it to a response stream. That will work but needs a lot of work serving files like unzip them if required, send chunks properly, set headers etc. Therefore end up using some already written implementation

`node-static-files` makes this simpler. This will handle file serving and stuff by taking some configurations.

=> For API endpoints. Use `req.url` to match endpoints and then send `JSON.stringify()` data over with

`"Content-Type": "application/json"`
`"Cache-Control": "no-cache"`

Express Js => Good choice.

```js
const express = require("express");

const app = express();

app.listen(3000, () => {
	// listening started
})

app.get("/apiendpoint", () => {
	// handle API logic here
})

// for static handling files
app.use(express.static); 
// app.use() is a general middleware that can handles all 
// kind of request
```

---

Workers

Node across many child process instnaces and communicate with them

```js
const childProc = require("child_process");
// we end up getting this separate object that has streams from this 
// that can be usedd to send stuff to it and read from it

const childProc = require("child_process");
  
async function main() {
 let child = childProc.spawn("node", ["child.js"]);
// Listen to child on when it exits.
 child.on("exit", (code) => {
 console.log(`Finished executing, ${code}`);
 });
}

main().catch(console.log);
```

`spaw` helps to spawn this child process that returns an object. This `child` has events on it to listen to and do stuff with it streams.

```js
//child.js
async function main(){
 for(let i =0 ; i< 100000; i++){
 i+=2;
 }
}
main().catch(console.log);
```

`node app.js` would return `0` that means it finishsed with succes.
`process.exitCode` can be used to set this.

`0` means everyhting was fine. 
Nonzero means something is wrong.

`node child.js && ls` if `child.js` did exit with `0` then it would run ls or else ls command wouldn't even run. That's one way of checking if `child.js` ran properly or not.

`const delay = util.promisfy(setTimeout)` then use it as `delay(1000)`

---

Debugging

using chrome dev tools

`chrome://inspect` => will start listening to remote targets
`node app.js --inspect`  will expose this inspect to chrome and there it can be `inspect` can use sources in the dev tools and step through and all the other stuff.


