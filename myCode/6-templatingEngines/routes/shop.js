const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
	//when using this method, even when a new user visits the webpage (u can open new tab and go to url), the data is shared (the items enetered in prev tab are also shown in console even when new user goes to site)
	//very rarely do we want this, tho doing it this way for now
	// console.log("shop.js", adminData.products);

	//its an array of objects, {title: entered_product}
	const products = adminData.products;

	//render provided by express, will use default templating engine (defined in app.set('view engine', ...))
	//we also defined that views are views dir (app.set("views", views)), so we dont have to construct a path to that folder
	//shop means shop.pug (defines pug as default templating engine)
	//like sendFile, this sends rendered html page
	//we can pass data that shud be added in our view (passing js obj here)
	res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
});

module.exports = router;
