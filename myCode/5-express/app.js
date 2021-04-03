const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require("./util/path");

const app = express();

PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));

//it serves static files, public contains all files which the user can see, here we are serving public folder statically, so if user goes to url /public/css/main.css, he/she can see the main.css file
//in the html files, when linking css files in <head>, think like we're already in public folder (as we served it statically), so path to css file will be /css/main.css
//this looks for any request that tries to file (by looking at the extension, like .css or .js file or img) and forwards it to the public folder, and so remaining path has to be without /public in it. so in html file, when linking the css file (href="/css/main.css"), a get request goes off, express sees the extension as .css, finds the statically served folder and looks for that file in it. (That is why writing the url /css in browsers gives 404 page, but /css/main.css actually gives the css code in the file)
//we can also register multiple static folders and it'll funnel the req thru all folders till 1st hit of the file specified
app.use(express.static(path.join(rootDir, 'public')));

//adminRoutes is a valid middleware function
//even if we switch up positions of adminroutes and shoproutes, it'll still execute, as now in shoproutes, we used get instead of use, and it does an exact match
//added a path filter as 1st arg, if all routes in adminRoutes start with /admin, we added it as 1st arg in use fn, then no need to write /admin/<path> in urls in adminRoutes. now only routes with /admin go to adminRoutes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//for any other url (like /lol), we get no fitting middleware here, so we reach here, we add a catch all middleware, we dont need path filter (default is /)
app.use((req, res, next) => {
	//we can chain many methods like setHeader also to res, send has to be the last one
	// res.status(404).send("<h1>Page not found</h1>");
	res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.listen(8000, () => {
	console.log(`Listening on port ${PORT}`);
});
// console.log(__dirname);
