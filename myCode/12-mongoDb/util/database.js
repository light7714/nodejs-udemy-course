//code to allow us to connect to the mongodb (we're using mongodb atlas)

const mongodb = require('mongodb');

const privateFile = require('./private');

const MongoClient = mongodb.MongoClient;

PASSWORD = 'shubham1234';

const mongoConnect = (callback) => {
	//creates a connection to mongodb, it takes a url to connect, which we got from mongodb atlas (srv address)
	//not directly exporting this, maybe cuz its a promise?? (maybe cus even if it resolves later after exporting, we cant be sure the file calling this would have code which waits for resolution of promise??)
	//useUnifiedTopology: true is just for removing warning for now
	MongoClient.connect(
		`mongodb+srv://shubham_temp:${privateFile.PASSWORD}@cluster0.b6e3a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
		{ useUnifiedTopology: true }
	)
		//we'll receive the client object here, and we wanna pass it to app.js where we call mongoConnect
		.then((client) => {
			console.log('Connected to mongodb!');
			callback(client);
		})
		.catch((err) => {
			console.log('err in connect in database.js:', err);
		});
};

module.exports = mongoConnect;
