## Note: Important sites are saved in pinterest

## MySQL community edition
By default, mysql is started, to stop it, use ```systemctl stop mysql```, for start, restart, or status, replace `stop` with that in command </br>
Easy way to see mysql in graphical way is to open mysql workbench </br>
To connect mysql in terminal (with root user), use command ```mysql -u root -p``` </br>

### in database.js
can create a connection object (mysql.createConnection), we'll need to close connection after we're done, downside here is we'll need to re execute the code the make the connection for every new query. (see more at docs of mysql2). </br>
better way: create a connection pool.
we will always reach out to it for every query, then we get a new connection from this pool, which manages multiple connections, after query its done, connection is handed back to pool and its available for new query. </br>

### in mysql workbench
When making columns of a new table, PK=primary key, NN=not null, UQ=unique, BIN=binary data, UN=unsigned (+ve nums only), ZF=zero filled (?), AI=autoincrement, G=generated column (???)

## Promises
#### see promises properly later
promises (a js obj) are for async code, an alternative for callbacks (could callbacks use in mysql package as well tho). Instead of passing a callback function to a function, and then executing it later, we can chain multiple then() blocks, and pass an anonymous fn in then block to execute after promise returns. </br>
catch block executes if there is any error, so we can directly catch all errs in then blocks in catch...

### in product.js in save method
//to stop sql injection attacks, we did this approach. The values in [] will be injected in the question marks by our mysql package, and it'll safely escape our input values to parse it for hidden sql commands and remove them, called prepared statements: https://github.com/sidorares/node-mysql2 </br>
for eg. a user entered a malicious sql command in the title field, so if we directly write this.title in VALUES (), then that command will get run in our db, which we dont want.

### in findById in shop.js controller
err handling inside then() is not done yet, like for eg if no id matches (like someone entered something in the url), then will mysql give error???? or give null value??