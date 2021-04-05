//controller for product related logic

const Product = require("../models/product");

//we get the Add product page here (it helps to get everything we need to add a product, so named this instead of getAddProductPage)
exports.getAddProduct = (req, res, next) => {
	res.render("add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
	});
};

exports.postAddProduct = (req, res, next) => {
	const product = new Product(req.body.title);
	product.save();
	res.redirect("/");
	// res.redirect("/admin/add-product");
};

exports.getProducts = (req, res, next) => {
	// const products = Product.fetchAll();
	// res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });

	//fetchAll takes a callback, which will be called when products array is ready
	Product.fetchAll((products) => {
		console.log(products);
		res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
	});
};
