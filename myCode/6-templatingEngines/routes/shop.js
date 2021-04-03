const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
	//when using this method, even when a new user visits the webpage (u can open new tab and go to url), the data is shared (the items enetered in prev tab are also shown in console even when new user goes to site)
	//very rarely do we want this, tho doing it this way for now
	console.log("shop.js", adminData.products);
	res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
