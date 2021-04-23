//code to allow us to connect to the mysql db

const mysql = require("mysql2");

//can create a connection object (mysql.createConnection), we'll need to close connection after we're done, downside here is we'll need to re execute the code the make the connection for every new query. (see more at docs of mysql2)
//better way: create a connection pool
//we will always reach out to it for every query, then we get a new connection from this pool, which manages multiple connections, after query its done, connection is handed back to pool and its available for new query 
const pool = mysql.createPool({
    host: "localhost",
    //user root was defined in mysql setup (default)
    user: "shubham_temp",
    //above code gives access to a db server, but a server can have different databases
    //can see mysql workbench for node-complete db
    database: "node-complete",
    password: "shubham@1234"
});

//using promise here
module.exports = pool.promise();