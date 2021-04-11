//controller for admin related logic

const Product = require("../models/product");

//we get the Add product page here (it helps to get everything we need to add a product, so named this instead of getAddProductPage)
exports.getAddProduct = (req, res, next) => {
	res.render("admin/add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	
	const product = new Product(title, imageUrl, price, description);
	product.save();
	res.redirect("/");
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render("admin/products", {
			prods: products,
			pageTitle: "Admin Products",
			path: "/admin/products",
		});
	});
};
