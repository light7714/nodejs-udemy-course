//controller for shop related logic

const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
	//fetchAll takes a callback, which will be called when products array is ready, that callback receives an array with products
	Product.fetchAll((products) => {
		res.render("shop/product-list", {
			prods: products,
			pageTitle: "All Products",
			path: "/products",
		});
	});
};

exports.getIndex = (req, res, next) => {
	//for now, index and product-list page get same arguments passed. tho index is empty rn
	Product.fetchAll((products) => {
		res.render("shop/index", {
			prods: products,
			pageTitle: "Shop",
			path: "/",
		});
	});
};

exports.getCart = (req, res, next) => {
	res.render("shop/cart", {
		path: "/cart",
		pageTitle: "Your cart"
	});
};

exports.getOrders = (req, res, next) => {
	res.render("shop/orders", {
		path: "/orders",
		pageTitle: "Your Orders"
	});
};

exports.getCheckout = (req, res, next) => {
	res.render("shop/checkout", {
		path: "/checkout",
		pageTitle: "Checkout"
	});
};