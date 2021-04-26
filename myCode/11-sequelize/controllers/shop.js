//controller for shop related logic

const Product = require('../models/product');
const Cart = require('../models/cart');

const errorController = require('./error');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(([rows, fieldData]) => {
			res.render('shop/product-list', {
				prods: rows,
				pageTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((err) => {
			console.log(
				'err in fetchAll promise chain in shop.js controller:',
				err
			);
		});
};

exports.getProduct = (req, res, next) => {
	//*productId was passed by the req as in the route, we handled it as :productId in url
	const prodId = req.params.productId;

	//*err handling inside then() is not done yet, like for eg if no id matches (like someone entered something in the url), then will mysql give error???? ANS: product[0] is undefined
	Product.findById(prodId)
		//if we dont write fieldData, it'll still work as it will fetch the 1st ele in product and leave the next ele
		.then(([product, fieldData]) => {
			//*product is still an array, with 1 ele tho, (as output of promise in findById is a nested array), but we need to pass the object, not the array, so passing product[0] in render
			res.render('shop/product-detail', {
				product: product[0],
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => {
			console.log('err in findById in shop.js controller:', err);
		});
};

exports.getIndex = (req, res, next) => {
	//fetchAll() returns a promise, the output is directly passed to then block
	Product.fetchAll()
		//we receive a nested array with 2 array ele here, so we used destructuring to get the eles in rows(answer of query in fetchAll definition, so entries in products table) and fieldData (extra data)
		.then(([rows, fieldData]) => {
			res.render('shop/index', {
				prods: rows,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => {
			console.log(
				'err in fetchAll promise chain in shop.js controller:',
				err
			);
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
