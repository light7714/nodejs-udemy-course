//controller for shop related logic

const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((err) => {
			console.log('err in fetchAll fn in shop.js:', err);
		});
};

exports.getProduct = (req, res, next) => {
	//*productId was passed by the req as in the route, we handled it as :productId in url
	const prodId = req.params.productId;

	Product.findById(prodId)
		.then((product) => {
			//*not in vid
			if (!product) {
				return errorController.get404(req, res, next);
			}

			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => {
			console.log('err in findById in shop.js controller:', err);
		});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => {
			console.log('err in fetchAll fn in shop.js:', err);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		//returns products which are there in the user's cart (with quantity field also added in each product)
		.getCart()
		.then((products) => {
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your cart',
				products: products,
			});
		})
		.catch((err) => {
			console.log('err in getCart() in shop.js:', err);
		});
};

exports.postCart = (req, res, next) => {
	//*productId was passed to request's body (in add to cart buttons)
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			//returning addToCart as it returns a promise (chain) here, so we can attach a then block below this
			return req.user.addToCart(product);
		})
		//no use of another then block if I dont wanna console log result
		.then((result) => {
			// console.log(result);
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log('err in findById in shop.js:', err);
		});
};

//*rn its removing the product completely, even if qty > 1 (in vid also)
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.deleteItemFromCart(prodId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log('err in deleteItemsFromCart() in shop.js:', err);
		});
};

exports.postOrder = (req, res, next) => {
	req.user
		.addOrder()
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((err) => {
			console.log('err in addOrder() in shop.js:', err);
		});
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders()
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
			});
		})
		.catch((err) => {
			console.log('err in gerOrders() in getOrders in shop.js');
		});
};
