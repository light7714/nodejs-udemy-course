const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
	// console.log(req.url, req.method, req.headers);
	const url = req.url;
	const method = req.method;
	if (url === "/") {
		res.setHeader("Content-Type", "text/html");
		res.write("<html>");
		res.write("<head><title>Enter Message</title><head>");
		//url in action will be sent the request generated automatically by the send button(as its inside form)
		///message automatically targets the host its running on
		//it automatically detect inputs or related ele
		//the name doesnt have to be 'message'. it'll add any input data to the request and make it accessible via the assigned name
		res.write(
			"<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
		);
		res.write("<html>");
		//return put here only so that we return from the function and not run code below it(short circuiting) (seen on stackoverflow also, return has no effect on createServer())
		return res.end();
	}

	if (url === "/message" && method === "POST") {
		const body = [];
		//we can listen to certain events using on method, so we're making an event listener
		//will be fired whenever a new chunk is ready to be read (chunk as in request stream, chunks of data is sent, 2nd arg is function to be executed for every event).
		req.on("data", (chunk) => {
			console.log(chunk); // we cant work directly with chunks
			body.push(chunk);
		});
		//code below this req.on stmts will run 1st, as we just register this fn to be called in future, thats why writeFileSync() is written inside this fn
		//return stmt so that when this event lisnr is regd, it'll return out of createserver callback fn, and not execute res.write code below, out of this if stmt
		return req.on("end", () => {
			//buffer the chunks to be able to work with them
			//create a new buffer and all chunks inside body in the buffer
			//converted to string, only works as we now incoming data is text, if it were something else, we would have to do something else
			//o/p will be message=<msg>, message is written as we gave name='message' to our html input. form sends the request, where it takes input data and puts it into request body as key value pairs, where names assigned to inputs are keys, values are what user entered. message is key, <msg> is value
			const parsedBody = Buffer.concat(body).toString();
			//console.log(parsedBody);
			const message = parsedBody.split("=")[1];
			//writeFile is async, writeFileSync is sync, no callback fn to be passed in sync
			fs.writeFile("message.txt", message, (err) => {
				//we can also write next 3 lines after this block as well, but if want to do something here which influences the response, then this is correct way, as the code after this event listener will run first.
				//we wanna redirect to / and store form data in a new file
				res.statusCode = 302; //for redirection
				res.setHeader("Location", "/");
				//we could do above 2 lines with res.writeHead(); (see syntax)
				res.end();
			});
		});
	}

	res.setHeader("Content-Type", "text/html");
	res.write("<html>");
	res.write("<head><title>New page woo</title><head>");
	res.write("<body><h1>New nodejs server!</h1></body>");
	res.write("<html>");
	res.end();
});

server.listen(8000);
