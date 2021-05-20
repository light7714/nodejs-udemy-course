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

	//mongoose document
	//* Mongoose queries are not promises. They have a .then() function for co and async/await as a convenience. If you need a fully-fledged promise, use the .exec() function.
	//*lhs is the attribute in model, rhs is above variable
	const product = new Product({
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		// userId: req.user._id,
		//*we can even just pass full user, as userId is defined as an ObjectId, it'll pick just the _id from user automatically
		userId: req.user,
	});

	product
		//mongoose save() method
		.save()
		.then((result) => {
			console.log('created Product');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log('err in save() in admin.js:', err);
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

	//mongoose static findById()
	Product.findById(prodId)
		.then((product) => {
			//*if no id matches, product receives undefined, and we need to return error page. In vid index page returned
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

	Product.findById(prodId)
		.then((product) => {
			//*product is not a js obj with just data, but its mongoose obj (doc) with all mongoose methods
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDescription;
			product.imageUrl = updatedImageUrl;
			//*When we call save() on an existing mongoose obj (which exists in db), it'll automatically update the existing one in db, not add a new document
			return product.save();
		})
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
	Product.find()

		//we dont need these commented features here, but just for knowledge
		// //*if we need to get only some fields, we could attach select. We can even get all fields excluding some, like select(-name). _id will always be retrieved unless explicitly excluded
		//* .select('title price -id')
		// //*if we want to get all user related data, and not just the userId in products, instead of writing nested queries, we attach populate('path-to-populate'), in our case just the userId attrib (we can also pass nested paths if we had one, like userId.cart._id ...)
		// //*2nd argument is getting only some fields, same as select()
		//*ALSO, Population does not occur unless a callback is passed or execPopulate() is called if called on a document. The result of Product.find() is a query and not a document so you can call .populate() on it right away.
		//* .populate('userId', 'name email')
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			});
		})
		.catch((err) => {
			console.log('err in find in admin js:', err);
		});
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;

	//mongoose static method findByIdAndRemove()
	Product.findByIdAndRemove(prodId)
		.then(() => {
			console.log('Destroyed the Product');
			return req.user.removeFromCart(prodId);
		})
		.then(() => {
			console.log('Removed Product from cart');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log('err in findByIdAndRemove() in admin.js:', err);
		});
};
