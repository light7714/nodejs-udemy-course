//its product.js, not products.js
//this represents a single entity (a product)

const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			// console.log(err);
			//passing empty array to callback
			cb([]);
		}
		else {
		cb(JSON.parse(fileContent));
		}
	});
};

module.exports = class Product {
	constructor(title) {
		this.title = title;
	}

	// save() {
	// 	const p = path.join(rootDir, "data", "products.json");
	// 	//readfile reads full content at a specified path, and th fn passed executes once reading is done
	// 	//after reading, we get error (null if no error) and the file content (a buffer)
	// 	//dont use this for big files, there are more efficient ways, like reading it as a stream (readStream fn)
	// 	//will get err, and err passed, when no file exists
	// 	fs.readFile(p, (err, fileContent) => {
	// 		let products = [];

	// 		//even if error is there, i still wanna write to a file (non-existant yet, thats why err here), that is why there is still code below this if block
	// 		if (!err) {
	// 			//gives arr or obj or whatever is in file
	// 			products = JSON.parse(fileContent);
	// 		}
	// 		products.push(this);

	// 		//if no file exists, it will create file and then write
	// 		fs.writeFile(p, JSON.stringify(products), (err) => {
	// 			console.log("writefileerror", err);
	// 		});
	// 	});
	// }

	save() {
		getProductsFromFile(products => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), err => {
				console.log(err);
			});
		});
	}

	//this is actually wrong, the return stmt is inside callback to readfile, not fetchall
	// static fetchAll() {
	// 	const p = path.join(rootDir, "data", "products.json");

	// 	fs.readFile(p, (err, fileContent) => {
	//         if(err) {
	//             return [];
	//         }
	//         return JSON.parse(fileContent);
	//     });
	// }

	//a callback fn is passed to fetchall, which we'll call later (to pass the products array in products.js controller)
	//thoughts: it kinda is like async fns like readFile.. except we arent passing anything to the event loop, we're doing it in the main thread
	static fetchAll(cb) {
		// const p = path.join(rootDir, "data", "products.json");

		// fs.readFile(p, (err, fileContent) => {
		// 	if (err) {
		// 		// console.log(err);
		// 		//passing empty array to callback
		// 		cb([]);
		// 	}
		// 	cb(JSON.parse(fileContent));
		// });

		getProductsFromFile(cb);
	}
};
