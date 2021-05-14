//controller for shop related logic

const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
	//mongoose method (static, so directly on Product model, instead of making an object 1st (ofc)) find(), it returns all products instead of cursor. we can still get cursor by find().cursor()
	Product.find()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((err) => {
			console.log('err in find() in shop.js:', err);
		});
};

exports.getProduct = (req, res, next) => {
	//*productId was passed by the req as in the route, we handled it as :productId in url
	const prodId = req.params.productId;

	//mongoose static method findById()
	//passing prodId string here, mongoose will convert it to ObjectId
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
			console.log('err in findById in shop.js:', err);
		});
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => {
			console.log('err in find() in shop.js:', err);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		//*Population does not occur unless a callback is passed or execPopulate() is called if called on a document. req.user is a document so you must call execPopulate on it
		.populate('cart.items.productId')
		.execPopulate()
		//we'll get the full user obj, with populated fields
		.then((user) => {
			//*actually its not products, it contains some product data (productId: {all_product_attributes}, quantity:~)
			const products = user.cart.items;
			//*in the view, product data will be avlbl on productId field, like product.productId.title, but quantity is on product.quantity only (see cart model in user model)
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
		.removeFromCart(prodId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log('err in removeFromCart() in shop.js:', err);
		});
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			//*actually user.cart.items was not products, it contains some product data (productId: {all_product_attributes}, quantity:~), thats why added map()
			const products = user.cart.items.map((i) => {
				//*actually if I just write i.productId, which contains all product data, also contains meta data mongoose added, and its somehow only storing the id in product field (due to too much meta data maybe..), if we want it to store just the data, we need to extract data from _doc (we cant see this behaviour in the console, as even in console it takes data from _doc behind the scenes) see link in README
				return {
					quantity: i.quantity,
					product: { ...i.productId._doc },
				};
			});

			const order = new Order({
				user: {
					name: req.user.name,
					userId: req.user,
				},
				products: products,
			});

			return order.save();
		})
		.then(() => {
			req.user.clearCart();
		})
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((err) => {
			console.log('err in populate() in shop.js (postOrder):', err);
		});
};

exports.getOrders = (req, res, next) => {
	Order
		.find({ 'user.userId': req.user._id })
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
