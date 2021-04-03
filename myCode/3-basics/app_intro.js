const http = require("http");

//req: request, res: response
//the fn inside(create server callback) is run each time the server receives a request, it as a request listener (so, an event listener)
//event driven code
const server = http.createServer((req, res) => {
	// console.log(req);
	// process.exit();		//hard exits the event loop
	console.log(req.url, req.method, req.headers);
	//more headers can be seen in dev tools in browser, in response headers, and are set by browser
	res.setHeader("Content-Type", "text/html");
	res.write("<html>");
	res.write("<head><title>New page woo</title><head>");
	res.write("<body><h1>New nodejs server!</h1></body>");
	res.write("<html>");
	res.end();
	//we can call res.write again and write data to response again, but it'll be an error
});

server.listen(3000); //port: 3000, localhost by default
