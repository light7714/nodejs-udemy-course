const path = require("path");

//handles creation of products, which admin of shop can do
const express = require("express");

const rootDir = require("../util/path");

//router is like a mini express app, pluggable in other express app
const router = express.Router();

//2 routes can have same url if method is different
// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
	// res.send(
	// 	"<form action='/admin/add-product' method='POST'><input type='text' name='title'><button type='submit'>Add product</button></form>"
	// );

	// res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
	//OR
	res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// /admin/agg-product => POST
router.post("/add-product", (req, res, next) => {
	console.log(req.body);
	res.redirect("/");
});

//returning the router object, which has the above 2 routes registered
module.exports = router;
