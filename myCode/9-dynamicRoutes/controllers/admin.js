//controller for admin related logic

const Product = require("../models/product");

const errorController = require("./error");

//we get the Add product page here (it helps to get everything we need to add a product, so named this instead of getAddProductPage)
exports.getAddProduct = (req, res, next) => {
	//edit-product is there instead of add-product 10th vid onwards
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	const product = new Product(null, title, imageUrl, price, description);
	product.save();
	res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
	//*See README.md
	//*only when edit is set somewhere in query params in the url, we'll get its value as string in editMode (so a string "true"). If its not set, we'll get undefined (which is treated as false in a boolean check)
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}

	//getting productId from the url
	const prodId = req.params.productId;
	Product.findById(prodId, (product) => {
		//*if no id matches (the prod id is not in products.json), product receives undefined, and we need to return error page
		//* not in vid
		if (!product) {
			return errorController.get404(req, res, next);
		}

		res.render("admin/edit-product", {
			pageTitle: "Edit Product",
			path: "/admin/edit-product",
			//sending additional info to view that upon clicking on save button, we wanna add a new product or edit existing one (as there is only 1 view for editing and adding product page)
			editing: editMode,
			product: product,
		});
	});
};

exports.postEditProduct = (req, res, next) => {
	//sending new values for product entered in edit product view
	//sending productId (hidden input) in post req body
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
	updatedProduct.save();
	res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render("admin/products", {
			prods: products,
			pageTitle: "Admin Products",
			path: "/admin/products",
		});
	});
};
