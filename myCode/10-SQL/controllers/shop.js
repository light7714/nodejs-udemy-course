//controller for shop related logic

const Product = require("../models/product");
const Cart = require("../models/cart");

const errorController = require("./error");

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render("shop/product-list", {
			prods: products,
			pageTitle: "All Products",
			path: "/products",
		});
	});
};

exports.getProduct = (req, res, next) => {
	//*productId was passed by the req as in the route, we handled it as :productId in url
	const prodId = req.params.productId;
	Product.findById(prodId, (product) => {
		//*if no id matches (the prod id is not in products.json), product receives undefined, and we need to return error page
		//* not in vid
		//* can also use if (typeof product === "undefined")
		if (!product) {
			return errorController.get404(req, res, next);
		}

		//*passing /products path here because we still wanna highlight Products link in nav bar, as we're viewing details of a specific product
		res.render("shop/product-detail", {
			product: product,
			pageTitle: product.title,
			path: "/products",
		});
	});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render("shop/index", {
			prods: products,
			pageTitle: "Shop",
			path: "/",
		});
	});
};

exports.getCart = (req, res, next) => {
	//cart received is null if no cart exists
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			const cartProducts = [];

			for (product of products) {
				//cartProductData contains product obj of cart model (with id and qty field), when the product exists in cart
				const cartProductData = cart.products.find(
					(prod) => prod.id === product.id
				);
				if (cartProductData) {
					cartProducts.push({
						productData: product,
						qty: cartProductData.qty,
					});
				}
			}
			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your cart",
				products: cartProducts,
			});
		});
	});
};

exports.postCart = (req, res, next) => {
	//*productId was passed to request's body (in add to cart buttons)
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.addProduct(prodId, product.price);
	});
	res.redirect("/cart");
};

//*rn its removing the product completely, even if qty > 1 (in vid also)
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.deleteProduct(prodId, product.price);
		res.redirect("/cart")
	});
};

exports.getOrders = (req, res, next) => {
	res.render("shop/orders", {
		path: "/orders",
		pageTitle: "Your Orders",
	});
};

exports.getCheckout = (req, res, next) => {
	res.render("shop/checkout", {
		path: "/checkout",
		pageTitle: "Checkout",
	});
};
