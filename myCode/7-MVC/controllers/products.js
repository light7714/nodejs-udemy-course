//controller for product related logic

const products = [];

//we get the Add product page here (it helps to get everything we need to add a product, so named this instead of getAddProductPage)
exports.getAddProduct = (req, res, next) => {
	res.render("add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
	});
};

exports.postAddProduct = (req, res, next) => {
	products.push({ title: req.body.title });
	res.redirect("/");
};

exports.getProducts = (req, res, next) => {
	res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
};
