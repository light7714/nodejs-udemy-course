//code to allow us to connect to the mongodb (we're using mongodb atlas)

const mongodb = require('mongodb');

const privateFile = require('./private');

const MongoClient = mongodb.MongoClient;

//underscore just to signal it'll be used internally in this file
let _db;

//we dont wanna make connection everytime a code wants to interact with db, so mongoConnect connects to the db once, and getDb returns the access to the connected db if it exists.

const mongoConnect = (callback) => {
	//creates a connection to mongodb, it takes a url to connect, which we got from mongodb atlas (srv address)
	//*useUnifiedTopology: true is just for removing warning for now
	//the part after .net/ and before ? mark is the database name we wanna connect to (rn its shop, so we'll be connecting to shop db).
	//we dont have to setup databases beforehand in mongoDb, like here we didnt create shop db anywhere still we are connecting to it. mongodb will automatically create one if it doesnt exist
	//*we can also enter db name in client.db(); (like client.db('test')), and then it will connect to test db instead of the db name written in srv address, regardless of which db is written in srv address.
	//remember, database is different than collection, see README
	MongoClient.connect(
		`mongodb+srv://shubham_temp:${privateFile.PASSWORD}@cluster0.b6e3a.mongodb.net/shop?retryWrites=true&w=majority`,
		{ useUnifiedTopology: true }
	)
		.then((client) => {
			console.log('Connected to mongodb!');
			//storing the connection (or access) to the database in _db
			_db = client.db();
			callback();
		})
		.catch((err) => {
			console.log('err in connect in database.js:', err);
		});
};

//getDb returns access to that connected db if it exists.
//*mongodb behind the scenes manages it with connection pooling, where it'll ensure there are multiple connections for multiple simultaneous interactions with the db
const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'No database found!';
}

//so mongoConnect is for connecting and then storing the connection to the db. it'll be called in app.js, so it'll keep running (the connection is running, as we stored it), we dont have to connect everytime.
exports.mongoConnect = mongoConnect;

exports.getDb = getDb;
