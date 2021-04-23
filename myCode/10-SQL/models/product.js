const db = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
	//for a new product, id is sent as null, but stored as a serial number by db (when calling save method)
	constructor(id, title, imageUrl, price, description) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.price = price;
		this.description = description;
	}

	//*used for adding a new product as well as editing an existing product
	save() {
		//id is inserted automatically by mysql engine
		//to stop sql injection attacks, we did this approach. The values in [] will be injected in the question marks by our mysql package, and it'll safely escape our input values to parse it for hidden sql commands and remove them. See README
		//for eg. a user entered a malicious sql command in the title field, so if we directly write this.title in VALUES (), then that command will get run in our db, which we dont want.
		return db.execute(
			"INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
			[this.title, this.price, this.description, this.imageUrl]
		);
	}

	static deleteById(id) {}

	//no callback passed here, we'll use promises now
	static fetchAll() {
		//returning a promise, the output here will directly get passed to then block!!
		return db.execute("SELECT * FROM products");
	}

	static findById(id) {
		return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
	}
};
