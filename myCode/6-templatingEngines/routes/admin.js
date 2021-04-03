const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
	res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
	//could have pushed body itself as its structure also has title, but later we'll push more things so thats why its done
	products.push({ title: req.body.title });
	res.redirect("/");
});

// module.exports = router;
exports.routes = router;
exports.products = products;
