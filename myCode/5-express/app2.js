const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//for each new request, the script runs top to bottom

//body parser
//written before routing middlewares, as parsing of body to be done no matter wherever the request ends up
//installing body-parser package for this (included in express by default, but still installing as it can be removed from express)
//urlencoded fn registers a middleware, it'll call next in the end, but before it, it'll parse the req body (each time here), it'll only parse bodies like sent thru a form (not files and json) and then make it a js obj with key value pair (key is name field in input in the form)
//see pinterest for extended (course says extended:true if it shud be able to parse non-default features..)
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/add-product", (req, res, next) => {
	res.send(
		"<form action='/product' method='POST'><input type='text' name='title'><button type='submit'>Add product</button></form>"
	);
});

// //will only execute for incoming post requests, has same syntas as app.use (use was executing for all requests, but we only want it for post). same for app.get and others, get and post and others do an exact match (unlike use)
app.post("/product", (req, res, next) => {
	//req doesnt parse request body by default, so we need to add a parser
	console.log(req.body);
	//no next here, so this request wont go to next middleware.
	res.redirect("/");
});

// / doesnt mean full path here, all paths starting with / included, so localhost:8000/ and localhost:8000/lol both work
//this middleware executes after /product one as we redirect user to /, then again script runs top to bottom (as no next there), then flow reaches this
app.use("/", (req, res, next) => {
	res.send("<h1>Hello from expressjs</h1>");
});

app.listen(8000);
