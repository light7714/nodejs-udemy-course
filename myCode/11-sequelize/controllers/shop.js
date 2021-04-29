//controller for shop related logic

const Product = require('../models/product');
const Cart = require('../models/cart');

const errorController = require('./error');
const sequelize = require('../util/database');

exports.getProducts = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((err) => {
			console.log('err in findAll fn in shop.js:', err);
		});
};

exports.getProduct = (req, res, next) => {
	//*productId was passed by the req as in the route, we handled it as :productId in url
	const prodId = req.params.productId;

	//in vid its Product.findByID, but its replaced in findByPk in sequelize v5
	Product.findByPk(prodId)
		//err handling not done rn, if no id matches then product is undefined
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => {
			console.log('err in findByPk in shop.js controller:', err);
		});

	//OR ANOTHER METHOD to findByPk()
	//tho we know we should get 1 item, we still get an array here(with 1 item in it) as it can return multiple items
	// Product.findAll({ where: { id: prodId } })
	// 	.then((products) => {
	// 		res.render('shop/product-detail', {
	// 			product: products[0],
	// 			pageTitle: products[0].title,
	// 			path: '/products',
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		console.log('err in findById in shop.js controller:', err);
	// 	});
};

exports.getIndex = (req, res, next) => {
	//findAll is a sequelize model fn, without sequelize we defined our own fetchAll method in the model, this time we use sequelize methods
	//could pass options as a js obj
	//assuming we get an array of products
	Product.findAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => {
			console.log('err in findAll fn in shop.js:', err);
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
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your cart',
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
	res.redirect('/cart');
};

//*rn its removing the product completely, even if qty > 1 (in vid also)
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.deleteProduct(prodId, product.price);
		res.redirect('/cart');
	});
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};
