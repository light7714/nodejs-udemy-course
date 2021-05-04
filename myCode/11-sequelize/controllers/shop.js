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
	req.user
		.getCart()
		.then((cart) => {
			// special method added by sequelize
			return cart.getProducts();
		})
		.then((products) => {
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your cart',
				products: products,
			});
			// console.log(products);
		})
		.catch((err) => {
			console.log('err in req.user.getCart in shop.js:', err);
		});
};

exports.postCart = (req, res, next) => {
	//*productId was passed to request's body (in add to cart buttons)
	const prodId = req.body.productId;
	let fetchedCart;
	let newQuantity = 1;

	//retreiving the cart for a specific user (who made postCart req)
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			//*finding the products for this user only, and only those products with the prodId
			//remember, getProducts fn is only avlbl on the cart obj made by sequelize, not on Cart model
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			let product;
			//if the product with the particular prodId exists in cart
			if (products.length > 0) {
				product = products[0];
			}

			//product is already in cart
			if (product) {
				// sequelize gives us a junction table key (as products and cart tables are linked thru cart-item table), so in this case, a cartItem attribute, and cart-item table holds other cart-item speicific attributes like the quantity attribute
				const oldQuantity = product.cartItem.quantity;
				newQuantity = oldQuantity + 1;

				return product;
			}

			//product not in cart
			//having nested then call as it makes things easier here
			return Product.findByPk(prodId);
		})
		.then((product) => {
			//another method added by sequelize for many to many relationships, will add the product id to the junction table (cart-item here)
			//*we also need to add the qty field, only passing product will only add the productId in cart-item table.
			//no need of return here i think, but it'll work
			return fetchedCart.addProduct(product, {
				through: { quantity: newQuantity },
			});
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log('err in req.user.getCart in shop.js:', err);
		});
};

//*rn its removing the product completely, even if qty > 1 (in vid also)
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.getCart()
		.then((cart) => {
			//*finding the products for this user only, and only those products with the prodId
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			const product = products[0];
			// removing the item from cartItem table
			return product.cartItem.destroy();
		})
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log('err in req.user.getCart in shop.js:', err);
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
