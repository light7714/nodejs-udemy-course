const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const PORT = 8080;
const USER = process.env.DB_user;
const PASSWORD = process.env.DB_password;
const MONGODB_URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.b6e3a.mongodb.net/messages?retryWrites=true&w=majority`;

app.use(express.json()); //for application/json data coming thru reqs
//extracting a single file stored in some field named image in the incoming requests (was added in react code in `formData.append('image', postData.image);`)
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
//middleware for any req that goes into /images
app.use('/images', express.static(path.join(__dirname, 'images')));

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
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
	console.log(error);
	//statusCode added by me, inc case its undefined, it'll be 500
	const status = error.statusCode || 500;
	//default property message, holds msg we pass to the constructor of the error obj
	const message = error.message;
	const data = error.data;
	res.status(status).json({
		message: message,
		data: data,
	});
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		//listen method actually returns us a new node server obj
		const server = app.listen(PORT, () => {
			console.log(`Listening on port ${PORT}`);
		});

		//websockets connection
		//require('socket.io'); returns a function which accepts the node server we made
		//io is basically the socket object
		//in newer version of socket.io, we need to explicitly handle cors: https://socket.io/docs/v3/handling-cors/
		// const io = require('socket.io')(server, {
		// 	cors: {
		// 		origin: 'http://localhost:3000',
		// 		methods: ['GET', 'POST'],
		// 	},
		// });

		//we also want to share the io instance to all files (as when we create post, we want to inform all users there only), so creating the socket connection in socket.js file
		const io = require('./socket').init(server);

		//setting up event listeners with .on()
		//when a new client connects, the fn is executed. arg to the fn (socket here) is the client connection. this fn will be executed for every new client.
		io.on('connection', (socket) => {
			console.log('Client connected!');
		});
	})
	.catch((err) => {
		console.log('err in mongoose.connect in app.js:', err);
	});

process.on('SIGINT', () => {
	console.log('\nShutting down');
	process.exit(1);
});
