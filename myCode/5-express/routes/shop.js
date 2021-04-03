const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

router.get("/", (req, res, next) => {
	//automatically sets header and content type
	//we can think like / is actually the app.js file (not this file as we export it there). if we write ./ (relative path used), we get error that path must be absolute. ACTUALLY / here refers to root folder on our OS
	// res.sendFile('/views/shop.html');

	//join returns a path by concatenating different segments, adjusts path relative to OS
	//__dirname is global var made avlbl by node, here it points to routes directory
	// console.log(__dirname);
	// res.sendFile(path.join(__dirname, "..", "views", "shop.html"));

	//OR
	res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
