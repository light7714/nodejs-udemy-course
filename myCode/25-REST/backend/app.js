const express = require('express');

const feedRoutes = require('./routes/feed');

const app = express();

const PORT = 8080;

// app.use(express.urlencoded());  //this is for data in form x-www-form-urlencoded (the default type when data submitted thru form post req)

app.use(express.json()); //for application/json data coming thru reqs

//*setting headers here to avoid cors issue
app.use((req, res, next) => {
	//* this * means setting these headers to all domains that should be able to access our server
	//this header allowes specific orogins to access our data
	res.setHeader('Access-Control-Allow-Origin', '*');
	// now we allow these origins to use specific http methods
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	//allowing headers that client might set on their reqs
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);

	next();
});

app.use('/feed', feedRoutes);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
