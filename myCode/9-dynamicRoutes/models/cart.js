const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
	//we will not be making a constructor like below as we dont want to create a new cart object and pass product in it for each product.
	// constructor () {
	//     this.products = [];
	//     this.totalPrice = 0;
	// }

	//*Approach: Fetch the previous cart (from file or db)
	//* analyse the cart => find existing products
	//*add new product/increase the quantity
	static addProduct(id, productPrice) {
		//Fetch the prev cart
		//readFile is async, so ofc all other logic inside it as callback (see promises later for better way)
		fs.readFile(p, (err, fileContent) => {
			let cart = { products: [], totalPrice: 0 };
			//err means cart doesnt exist
			//then manually create cart.json, Im not doing it here in code
			if (!err) {
				cart = JSON.parse(fileContent);
			}

			// analyse the cart => find existing products
			//findIndex is just like find fn, just returns index of the member in the array
			const existingProductIndex = cart.products.findIndex(
				(prod) => prod.id === id
			);
			const existingProduct = cart.products[existingProductIndex];
			let updatedProduct;

			//add new product/increase the quantity
			if (existingProduct) {
				updatedProduct = { ...existingProduct };
				//*assuming product also has an quantity attribute (qty)
				updatedProduct.qty = updatedProduct.qty + 1;

				//functional programming technique:
				//Depending on the complexity of your project/ code, you can introduce bugs if you mutate the original value (because of the reference-vs-primitive type thing in JS: https://academind.com/learn/javascript/reference-vs-primitive-values/).
				//*By always creating a new object/ array, you ensure that you never edit the old value which might cause side-effects in other parts of your app.
				cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = { id: id, qty: 1 };
				//adding the updatedProduct as a new additional product
				cart.products = [...cart.products, updatedProduct];
			}

			//*productPrice was originally string, this + operator converts it to number
			cart.totalPrice = cart.totalPrice + +productPrice;

			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log("Error in writeFile (cart.js)", err);
			});
		});
	}

	//can also refactor the code, but duplicating it here to make it easier to understand
	//getting price as we need to update total cart price also
	static deleteProduct(id, productPrice) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				return;
			}

			const cart = JSON.parse(fileContent);
			const updatedCart = { ...cart };
			const product = updatedCart.products.find((prod) => prod.id === id);
			//if product doesnt exist in cart, then do nothing (used when calling deleteProduct in admin products view in delete button there)
			if (!product) {
				return;
			}
			const productQty = product.qty;

			//deleting product from cart, for filter exaplanation see product.js model
			updatedCart.products = updatedCart.products.filter(
				(prod) => prod.id !== id
			);
			updatedCart.totalPrice =
				updatedCart.totalPrice - productPrice * productQty;

			fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
				console.log("Error in writeFile (cart.js)", err);
			});
		});
	}

	static getCart(cb) {
		fs.readFile(p, (err, fileContent) => {
			const cart = JSON.parse(fileContent);
			if (err) {
				cb(null);
			} else {
				cb(cart);
			}
		});
	}
};
