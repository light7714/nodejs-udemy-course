const http = require("http");

//routes will contain requestHandler obj
const routes = require("./routes");

console.log(routes.someText);
//executing fn inside routes
const server = http.createServer(routes.handler);

server.listen(8000);