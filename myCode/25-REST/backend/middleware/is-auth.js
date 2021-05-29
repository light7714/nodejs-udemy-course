const jwt = require('jsonwebtoken');

require('dotenv').config();

//extracting jwt from an incoming req
//we'll be passing the token in the headers (for all requests)
//in the header, we wrote `Authorization: 'Bearer ' + this.props.token`
//bearer (plus whitespace) is just convention to identify that the token here is authentication token, typically used for jwt
module.exports = (req, res, next) => {
	//can get headers using get method
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		const error = new Error('Not Authenticated');
		error.statusCode = 401;
		throw error;
	}
	//we're only interested in the token itself, not bearer
	const token = authHeader.split(' ')[1];
	let decodedToken;
	//trying to decode the token (could fail ???), so adding try catch
	try {
		//*will decode and verify the token
		decodedToken = jwt.verify(token, process.env.jwt_secret);
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}
	//will be undefined if it wasnt verified
	if (!decodedToken) {
		const error = new Error('Not Authenticated');
		error.statusCode = 401;
		throw error;
	}

	//now we have a valid decoded token

	//storing the userId in the token to use it in other places
	req.userId = decodedToken.userId;
	next();
};
