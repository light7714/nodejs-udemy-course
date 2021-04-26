//controller for admin related logic

const Product = require('../models/product');

const errorController = require('./error');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	const product = new Product(null, title, imageUrl, price, description);

	product
		.save()
		.then(() => {
			res.redirect('/');
		})
		.catch((err) => {
			console.log('err is save fn in admin.js controller:', err);
		});
};

exports.getEditProduct = (req, res, next) => {
	//*only when edit is set somewhere in query params in the url, we'll get its value as string in editMode (so a string "true"). If its not set, we'll get undefined (which is treated as false in a boolean check)
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}

	//getting productId from the url
	const prodId = req.params.productId;
	Product.findById(prodId, (product) => {
		//*if no id matches (the prod id is not in products.json), product receives undefined, and we need to return error page
		//* not in vid
		if (!product) {
			return errorController.get404(req, res, next);
		}

		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product: product,
		});
	});
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const updatedProduct = new Product(
		prodId,
		updatedTitle,
		updatedImageUrl,
		updatedPrice,
		updatedDescription
	);

	//* instead of below code, we should pass a callback to save fn, as we wanna redirect only after we're done updating prods, or we can still see old prod details. Will add later in course
	updatedProduct.save();
	res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
		});
	});
};

exports.postDeleteProduct = (req, res, next) => {
	//sending productId (hidden input) in post req body (in admin products page where the delete btn is present)
	const prodId = req.body.productId;

	//* instead of below code, we should pass a callback to deleteById, as we wanna redirect only after we're done, or we can still see products which have been deltd from cart and product json files. Will add later in course
	Product.deleteById(prodId);
	res.redirect('/admin/products');
};
