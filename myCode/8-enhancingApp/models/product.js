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
	constructor(title) {
		this.title = title;
	}

	save() {
		getProductsFromFile((products) => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log("err in writefile: ", err);
			});
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}
};
