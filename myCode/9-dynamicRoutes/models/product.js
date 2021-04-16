const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

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

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(id, cb) {
		getProductsFromFile((products) => {
			//The find() method returns the value of the first element in an array that passes a test (provided as a function), otherwise returns undefined
			//here each product is passed one-by-one as p, it checks the condition in return stmt, returns the 1st value for which its true
			//its a synchronous fn, so code even after this, works
			const product = products.find((p) => p.id === id);
			cb(product);
		});
	}
};
