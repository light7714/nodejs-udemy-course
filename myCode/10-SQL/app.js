const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require("./util/path");
const errorController = require("./controllers/error");
const db = require("./util/database");

const app = express();

const PORT = 8000;

//to execute a cmd, we can use execute or query method, but execute is safer??
//we returned a connection pool promise in util/database.js, so we can use then and catch methods here
//SEE README
//could use callbacks in mysql package as well tho
db.execute("SELECT * FROM products")
	.then((result) => {
		//result is a nested array with 1st ele as the row we wanted (of table), and next ele a metdata (buffer in my case)
		console.log(result[0], result[1]);
	})
	.catch((err) => {
		console.log("err in promise in app.js:", err);
	});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
