const http = require("http");

//req: request, res: response
//the fn inside(create server callback) is run each time the server receives a request
const server = http.createServer((req, res) => {
	console.log(req);
});

server.listen(3000);    //port: 3000, localhost by default