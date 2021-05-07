const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product {
	constructor(title, price, description, imageUrl, id) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		//if id not passed, it'll be undefined, and autogenerated by mongodb later (will be passed when editing product)
		//*ternary exp cuz when we have an id passed (means we're in the process of editing product), then we define it as ObjectId, otherwise we need it null (so that it can go into the else block of inserting new product in save method)
		this._id = id ? new mongodb.ObjectId(id) : null;
	}

	save() {
		//this is database. the next lvl, collection, is below.
		const db = getDb();
		let dbOp; //db Operation

		if (this._id) {
			//Update the product

			//*updateOne takes atleast 2 args, 1st is filter to define which ele is updated, 2nd is how we wanna update that document
			//it doesnt replace simply (so we cant just pass 'this'), instead we have to describe the operation
			//*$set is special property name, takes an obj as a value, where we describe the changes we wanna make. here now we can pass 'this', and it means we're telling mongodb to set the key values (title, price, description, url) in this obj to the document it found. It works as the attributes of this obj are just key value pairs which exist already in document in db
			//*tho we could do it like $set: {title: this.title, ...}
			//*id will not be overwritten (maybe cus its autogenerated)
			dbOp = db
				.collection('products')
				.updateOne({ _id: this._id }, { $set: this });
		} else {
			//Insert a product

			//setting the collection with which we wanna work here. can connect to any collection, if it doesnt exist yet, it'll be created
			//to insert one document in the collection, insertOne() method, for many its insertMany() (takes array of js objs)
			//its a js obj, it'll be converted to json (bson) by mongodb
			// db.collection('products').insertOne({ name: 'A book', price: 12 });
			//but we wanna insert the obj, so passing 'this'
			//*the document also gets an automatically added _id attribute (we can see that outputting result of insertOne() in product.js)
			//*its a promise, then and catch blocks attached outside else block
			dbOp = db.collection('products').insertOne(this);
		}
		//*returning this whole chain as it'll allow us to treat this as a promise and chain then blocks (where the save() method will be called) (we can chain then block below catch block i think)
		return dbOp
			.then((result) => {
				console.log(result);
			})
			.catch((err) => {
				console.log('err in insertOne in product.js:', err);
			});
	}

	static fetchAll() {
		const db = getDb();

		//mongodb method find, to find data (configurable, for eg, .find({title: 'Book'}    and many more filters avlbl). gives all data by default
		//*find returns a cursor, an obj given by mongodb, allows us to go thru our eles or documents step by step (as find could return millions of docs and we dont wanna transfer them all at once)
		//toArray() (cursor.toArray() is a mongodb method) converts the obj to js array, but should only use that when we know there are less documents. Otherwise pagination shud be implemented (will do later). toArray() returns a promise
		return db
			.collection('products')
			.find()
			.toArray()
			.then((products) => {
				console.log(products);
				//*returning products as this whole promise chain is returned, so we can attach then blocks to fetchAll() wherever its called and expect to get products
				return products;
			})
			.catch((err) => {
				console.log(
					'err in toArray in find in db.collection in product.js:',
					err
				);
			});
	}

	static findById(prodId) {
		const db = getDb();

		//*to get the next object from a cursor, we can call next() method (mongodb method), and here we know it'll be the last document(as only 1 ele is there which matches the condition)
		return (
			db
				.collection('products')
				//*_id is actually stored in mongodb as ObjectId type (a type existing due to BSON maybe) (can see in mongodb compass) so we cant just equate ObjectId  with a string (prodId)
				// .find({ _id: prodId })
				.find({ _id: new mongodb.ObjectId(prodId) })
				.next()
				.then((product) => {
					console.log(product);
					return product;
				})
				.catch((err) => {
					console.log(
						'err in next in find in db.collection in product.js:',
						err
					);
				})
		);
	}

	static deleteById(prodId) {
		const db = getDb();
		return db
			.collection('products')
			.deleteOne({
				_id: new mongodb.ObjectId(prodId),
			})
			.then((result) => {
				console.log('Deleted!');
			})
			.catch((err) => {
				console.log(
					'err in deleteOne in db.collection in product.js:',
					err
				);
			});
	}
}

module.exports = Product;
