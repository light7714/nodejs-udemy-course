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
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.price = price;
		this.description = description;
	}

	//*used for adding a new product as well as editing an existing product
	save() {
		getProductsFromFile((products) => {
			//this.id != null for an existing product, we're updating existing product in this if block
			if (this.id) {
				const existingProductIndex = products.findIndex(
					(prod) => prod.id === this.id
				);
				const updatedProducts = [...products];
				//*when editing product (in some controller), we'll ofc make a Product obj, so the constructor initialisations are actually with updated fields the user entered. so we can directly replace old obj as existingProductIndex with `this` obj
				updatedProducts[existingProductIndex] = this;
				fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
					if (err) {
						console.log("Error in writeFile (product.js)", err);
					}
				});
			} else {
				//not gauranteed to be unique
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
			const product = products.find((prod) => prod.id === id);
			cb(product);
		});
	}
};
