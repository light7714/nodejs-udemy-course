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

	const product = new Product(title, price, description, imageUrl);

	//*the document also gets an automatically added _id attribute (we can see that outputting result of insertOne() in product.js)
	product
		.save()
		.then((result) => {
			// console.log(result);
			console.log('created Product');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log('err in createProduct in admin.js:', err);
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

	Product.findById(prodId)
		.then((product) => {
			//*if no id matches (the prod id is not in products.json), product receives undefined, and we need to return error page
			//* in vid we're redirecting to index page
			if (!product) {
				return errorController.get404(req, res, next);
			}

			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
			});
		})
		.catch((err) => {
			console.log('err in findById in admin.js:', err);
		});
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;

	const product = new Product(
		updatedTitle,
		updatedPrice,
		updatedDescription,
		updatedImageUrl,
		prodId
	);

	product
		.save()
		.then((result) => {
			console.log('Updated the Product!');
			//* if we do have an err, we wont get redirected.. we'll learn how to deal with this later
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log('err in save in admin.js', err);
		});
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			});
		})
		.catch((err) => {
			console.log('err in findAll in admin js:', err);
		});
};

exports.postDeleteProduct = (req, res, next) => {
	//sending productId (hidden input) in post req body (in admin products page where the delete btn is present)
	const prodId = req.body.productId;

	Product.deleteById(prodId)
		.then(() => {
			console.log('Destroyed the Product');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log('err in deleteById in admin.js:', err);
		});
};
