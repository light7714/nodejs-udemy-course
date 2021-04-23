const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");
const Cart = require("./cart");

const p = path.join(rootDir, "data", "products.json");

//getProductsFromFile expects a callback function, that callback function expects an array
const getProductsFromFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		//if fileContent buffer is empty, then too if block must run
		if (err || fileContent.length === 0) {
			cb([]);
		} else {
			cb(JSON.parse(fileContent));
		}
	});
};

module.exports = class Product {
	//for a new product, id is sent as null
	constructor(id, title, imageUrl, price, description) {
		// id is null cuz newly making a product, it'll be updated in save()
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.price = price;
		this.description = description;
	}

	//used for adding a new product as well as editing an existing product
	save() {
		getProductsFromFile((products) => {
			//this.id != null for an existing product, we're updating existing product in this if block
			if (this.id) {
				const existingProductIndex = products.findIndex(
					(prod) => prod.id === this.id
				);
				const updatedProducts = [...products];
				//when editing product, we'll ofc make a Product obj, so the constructor initialisations are actually with updated fields the user entered. so we can directly replace old obj as existingProductIndex with `this` obj
				updatedProducts[existingProductIndex] = this;
				fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
					if (err) {
						console.log("Error in writeFile (product.js)", err);
					}
				});
			} else {
				//setting a unique id when adding a product (for eg it'll be used when clicking on details btn on product-list page). For now its math.random only(not gauranteed to be unique)
				this.id = Math.random().toString();
				products.push(this);
				fs.writeFile(p, JSON.stringify(products), (err) => {
					if (err) {
						console.log("Error in writeFile (product.js)", err);
					}
				});
			}
		});
	}

	static deleteById(id) {
		getProductsFromFile((products) => {
			const product = products.find((prod) => prod.id === id);

			//filter fn (synchronous) also loops thru the array one-by-one (each ele stored in prod, at a time), returns all those ele which match a condition in the return stmt (so all those ele which give true on the condition)
			//to delete ele, we just want to return all ele which are not equal to id, the left out one is the product we wanted to dlt
			const updatedProducts = products.filter((prod) => prod.id !== id);
			fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
				if (!err) {
					//also remove the product from cart
					Cart.deleteProduct(id, product.price);
				}
			});
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(id, cb) {
		getProductsFromFile((products) => {
			//The find() method returns the value of the first element in an array that passes a test (provided as a function), otherwise returns undefined
			//here each product is passed one-by-one as p, it checks the condition in return stmt, returns the 1st value for which its true
			//its a synchronous fn, so code even after this, works
			const product = products.find((prod) => prod.id === id);
			cb(product);
		});
	}
};
