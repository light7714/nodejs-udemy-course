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

//take all cart items and move them into an order
//basic err handling not done (like cart empty)
exports.postOrder = (req, res, next) => {
	let fetchedCart;

	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then((products) => {
			//can restructure code to not use nested promise
			return (
				req.user
					.createOrder()
					//associating the products in cart to the order. the entries will be added to junction table orderItem
					.then((order) => {
						//*this approach is wrong, because how will we set quantity field.. addProducts adds multiple rows in orderItem table, and each have different quantity.
						//* order.addProducts(products, { through: { quantity: } });

						//*modifying products we pass to addProducts
						//array.map() methods returns a modified array, it takes a fn that takes each element one-by-one, and modifies those elements
						return order.addProducts(
							//*here we change products array slightly. For each product, we set the values of orderItem junction table (it only has id (autoimcrement) and quantity defined by us).
							//*we set the quantity for each order item for a product to be same as quantity in the cartItem for that product.
							products.map((product) => {
								product.orderItem = {
									quantity: product.cartItem.quantity,
								};
								return product;
							})
						);
					})
					.catch((err) => {
						console.log(
							'err in createOrder in getCart in postOrder in shop.js:',
							err
						);
					})
			);
		})
		.then((result) => {
			//now we want to clear the cart (it'll remove the rows in cartItems for that user)
			//*cant use destroy method here, that is used to clear a row (i think)
			fetchedCart.setProducts(null);
		})
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((err) => {
			console.log('err in getCart in postOrder in shop.js:', err);
		});
};

exports.getOrders = (req, res, next) => {
	req.user
		//*this is called Eager Loading, here we mean that if we're fetching orders, then we also want to fetch the related products. this will also give us products per order.
		//*so each order will now have a products array
		//* we did this because we were not able to access order.orderItem in the ejs file to display quantity.
		//*we associated order to product table, and sequelize pluralizes name, thats why wrote products
		.getOrders({ include: ['products'] })
		.then((orders) => {
			// console.log(orders);
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
			});
		})
		.catch((err) => {
			console.log('err in gerOrders in getOrders in shop.js');
		});
};
