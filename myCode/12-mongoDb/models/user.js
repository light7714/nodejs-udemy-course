//no auth for now, so making a dummy user who doesnt have to log in

const getDb = require('../util/database').getDb;

const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
	constructor(username, email, cart, id) {
		this.name = username;
		this.email = email;
		//*looks liks: {items: [ {productId:~, quantity:~}, {}, ...]}
		this.cart = cart;
		this._id = id;
	}

	save() {
		const db = getDb();
		return (
			db
				.collection('users')
				//will automatically add _id field as well (even tho later here we're manually adding _id field (when writing addToCart() method's code))
				.insertOne(this)
		);
	}

	//remember, addtoCart() will be called on a user object
	addToCart(product) {
		//assuming now that we have a cart property on our user
		//js function findIndex: returns -1 if condn not satisfied
		//** product._id is treated as a string in JS, but actually it is not a string really, so used ObjectId method toString() for proper comparision
		// console.log('hello', typeof product._id);
		const cartProductIndex = this.cart.items.findIndex((cp) => {
			return cp.productId.toString() === product._id.toString();
		});

		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];

		//product already exists in cart
		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		}
		//product doesnt exist in cart
		else {
			updatedCartItems.push({
				productId: new ObjectId(product._id),
				quantity: newQuantity,
			});
		}

		const UpdatedCart = {
			items: updatedCartItems,
		};

		//In old approach below, we are always overwriting all the items in cart, but we should either add a new item to the cart (in the items array), or update an existing one....

		//we also wanna add a quantity field
		//adding quantity field on the fly
		// product.quantity = 1;

		//more elegant than above commented approach
		//pulling out all fields of product obj into another obj, adding/overwriting new field quantity to the new obj)
		// const UpdatedCart = {
		// 	items: [{ product, quantity: 1 }],
		// };

		//new approach: not embedding whole product as if product changes, we need to change it in cart too
		// const UpdatedCart = {
		// 	items: [
		// 		{ productId: new ObjectId(product._id), quantity: newQuantity },
		// 	],
		// };

		const db = getDb();
		return (
			db
				.collection('users')
				//_id is the id stored in the collection
				.updateOne(
					{ _id: new ObjectId(this._id) },
					//overwriting cart attribute only, keeping all other fields same for the user
					{ $set: { cart: UpdatedCart } }
				)
		);
	}

	//returning array of all those products (objs) which have been added to cart (for the user on which this method has been called ofc), and also included a quantity attribute in each product.
	getCart() {
		const db = getDb();
		//productIds is an array of just strings (product ids) (items is array of objects with productId and quantity field)
		const productIds = this.cart.items.map((i) => {
			return i.productId;
		});

		//we have the user and cart data (in req.user), now we need product data
		//*we are telling mongodb to give us all products (in cursor form till find()) where _id is one of the ids mentioned in productIds array (so, products which are there in cart)
		return (
			db
				.collection('products')
				//*mongodb query syntax
				.find({ _id: { $in: productIds } })
				.toArray()
				.then((products) => {
					//*products array is array of all products in cart
					//*returning all products (in cart) with a quantity field added to the product objects
					//can think like
					//changedProducts = products.map(...)
					//return changedProducts

					return products.map((p) => {
						//* js function find(), returning an obj for each product, with its qty in cart added as an attribute to it
						//find returns the product obj, we need quantity, thats why added find(fn).quantity
						return {
							...p,
							quantity: this.cart.items.find((i) => {
								return (
									p._id.toString() === i.productId.toString()
								);
							}).quantity,
						};
					});
				})
				.catch((err) => {
					console.log('err in collection.find in user.js:', err);
				})
		);
	}

	deleteItemFromCart(productId) {
		//js filter method returns a new array with filtered items (all items which make it thru the filter). filter is a fn, runs on every item. return shud be true if we want to keep a particular item, else false.
		//keeping all items, except for one we delete
		const updatedCartItems = this.cart.items.filter((item) => {
			return item.productId.toString() !== productId.toString();
		});

		const db = getDb();
		return (
			db
				.collection('users')
				//_id is the id stored in the collection
				.updateOne(
					{ _id: new ObjectId(this._id) },
					//overwriting cart attribute only, keeping all other fields same for the user
					{ $set: { cart: { items: updatedCartItems } } }
				)
		);
	}

	//*adds an orders, also empties the cart
	/*An order will look like:
	_id:~
	items:
		{_id(product):~
		title:~
		price:~
		description:~
		imageUrl:~
		quantity:~
		},
		{...}
	user:
		{_id(user):~
		name:~
		}
	*/
	addOrder() {
		const db = getDb();

		return (
			this.getCart()
				//we get the cart products with quantity field included
				.then((products) => {
					//we need product data (some) as well to display on the orders page
					//*so items here is an array of products with all product info and the quantity
					///8=*even if product data changes here, we dont care, we wont update it (acc to vid) cuz here, we do want the snapshot of (old) products
					const order = {
						items: products,
						//*duplicating data.. as we dont need to change it too often.. for processed orders, even if the username did change, it doesnt affect too much if we dont change name in the processed order
						user: {
							_id: new ObjectId(this._id),
							name: this.name,
						},
					};

					return db.collection('orders').insertOne(order);
				})
				.then((result) => {
					//*emptying the cart now (already inserted it into order before clearing it)
					//in user obj
					this.cart = { items: [] };

					//in db
					return db
						.collection('users')
						.updateOne(
							{ _id: new ObjectId(this._id) },
							{ $set: { cart: { items: [] } } }
						);
				})
				.catch((err) => {
					console.log(
						'err in getCart() inside addOrder() in user.js:',
						err
					);
				})
		);
	}

	getOrders() {
		const db = getDb();
		//finding all orders in the orders model for the current user
		//specifying path to user _id (mongodb syntax), it'll will look for _id in the embedded user document
		return db
			.collection('orders')
			.find({ 'user._id': new ObjectId(this._id) })
			.toArray();
	}

	static findById(userId) {
		const db = getDb();
		return (
			db
				.collection('users')
				//not using find, as we know there'll be only 1 user
				.findOne({ _id: new ObjectId(userId) })
				//* It doesnt matter if we do below method of returning user in then block, or we just return till above, wherever findById() is called, the then chains there will receive user only. tho we shud do have then blocks here too i think, to better catch errors

				.then((user) => {
					//*returning user as this whole promise chain is returned, so we can attach then blocks to findById() wherever its called and expect to get user
					return user;
				})
				.catch((err) => {
					console.log('err in next in find in db.collection');
				})
		);
	}
}

module.exports = User;
