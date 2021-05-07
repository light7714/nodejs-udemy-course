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

// exports.getEditProduct = (req, res, next) => {
// 	//*only when edit is set somewhere in query params in the url, we'll get its value as string in editMode (so a string "true"). If its not set, we'll get undefined (which is treated as false in a boolean check)
// 	const editMode = req.query.edit;
// 	if (!editMode) {
// 		return res.redirect('/');
// 	}
// 	//getting productId from the url
// 	const prodId = req.params.productId;

// 	//To only get the product which the user has created, we use sequelize special method getProducts in req.user. will return array
// 	req.user
// 		.getProducts({ where: { id: prodId } })
// 		// Product.findByPk(prodId)		//old approach
// 		//array of 1 ele here
// 		.then((products) => {
// 			//*if no id matches (the prod id is not in products.json), product receives undefined, and we need to return error page
// 			//* in vid we're redirecting to index page
// 			const product = products[0];
// 			if (!product) {
// 				return errorController.get404(req, res, next);
// 			}

// 			res.render('admin/edit-product', {
// 				pageTitle: 'Edit Product',
// 				path: '/admin/edit-product',
// 				editing: editMode,
// 				product: product,
// 			});
// 		})
// 		.catch((err) => {
// 			console.log('err in getProducts in admin.js:', err);
// 		});
// };

// //not using new approach in above getEditProduct, as assuming when user clicks edit button, only his/her products have been loaded for him/her to click edit on them
// exports.postEditProduct = (req, res, next) => {
// 	const prodId = req.body.productId;
// 	const updatedTitle = req.body.title;
// 	const updatedPrice = req.body.price;
// 	const updatedImageUrl = req.body.imageUrl;
// 	const updatedDescription = req.body.description;

// 	Product.findByPk(prodId)
// 		.then((product) => {
// 			product.title = updatedTitle;
// 			product.price = updatedPrice;
// 			product.imageUrl = updatedImageUrl;
// 			product.description = updatedDescription;

// 			//save method given by sequelize, saves it back to the db, if product doesnt exist it'll create new, else overwrite
// 			//*instead of attaching a then and catch block to save() (which will make nesting look ugly), we return the promise returned by save method, and add a then block after this block is over, and handle this return there
// 			return product.save();
// 		})
// 		.then((result) => {
// 			console.log('Updated the Product!');
// 			//* if we do have an err, we wont get redirected.. we'll learn how to deal with this later
// 			res.redirect('/admin/products');
// 		})
// 		.catch((err) => {
// 			//this block catches err for both the findByPk promise and the save promise
// 			console.log('err in findByPk, save in admin.js', err);
// 		});
// };

// exports.getProducts = (req, res, next) => {
// 	// Product.findAll()	//old approach
// 	//getting all products for a user (who created those products)
// 	req.user
// 		.getProducts()
// 		.then((products) => {
// 			res.render('admin/products', {
// 				prods: products,
// 				pageTitle: 'Admin Products',
// 				path: '/admin/products',
// 			});
// 		})
// 		.catch((err) => {
// 			console.log('err in findAll in admin js:', err);
// 		});
// };

// //not using new approach like in above getEditProduct, as assuming when user clicks delete button, only his/her products have been loaded for him/her to click delete on them
// exports.postDeleteProduct = (req, res, next) => {
// 	//sending productId (hidden input) in post req body (in admin products page where the delete btn is present)
// 	const prodId = req.body.productId;

// 	//we can call destroy method and pass condition in a js obj inside it
// 	// Product.destroy({where: });
// 	//OR we do below

// 	Product.findByPk(prodId)
// 		.then((product) => {
// 			return product.destroy();
// 		})
// 		.then((result) => {
// 			console.log('Destroyed the Product');
// 			res.redirect('/admin/products');
// 		})
// 		.catch((err) => {
// 			console.log('err in findByPk, destroy in admin js:', err);
// 		});
// };
