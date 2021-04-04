const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require("./util/path");

const app = express();

//set allows to set any values globally on our app
//it can be keys or config items, which express doesnt understand, and it ingores them (see more about app.set(name, value))
//we will set some reserved names here (config items) using which express behaves differently
//view engine: for any dynamic template we're rendering, use the specified engine
//pug ships with built in express support and auto reigsters it with express, so it works this way, for other engines its different
// app.set("view engine", "pug");

//for EJS
app.set("view engine", "ejs");
//views: where to find dynamic views (docs: default value is views dir in project dir), but still writing explicitly here
app.set("views", "views");

PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
	// res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
	res.status(404).render("404", { pageTitle: "Page not found" });
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
// console.log(__dirname);
