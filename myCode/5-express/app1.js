// const http = require("http");

const express = require("express");

const app = express();

//use is one middleware, accepts array of req handlers
//we can use any fn which receives these 3 args, it'll execute for every incoming req
//next is a fn which will be passed by express, has to be executed to allow req to travel to next middleware
//we can use this fn in different ways
///default path is /
app.use("/", (req, res, next) => {
	console.log("In middleware");
	//if we dont call next(), next middleware fn (app.use) will not execute, so we usually send back a response
	next();
});

app.use((req, res, next) => {
	console.log(`In another middleware`);
	//default header is text/html in express
	res.send("<h1>Hello from expressjs</h1>");
});
//app is also a valid request handler also
// const server = http.createServer(app);

// server.listen(3000);

//OR
app.listen(8000);
