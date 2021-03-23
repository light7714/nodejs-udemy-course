//Callbacks
// const fetchData = callback => {
// 	//Async code
//     setTimeout(() => {
//         callback('HIII this is THE callback');
//     }, 1500);
// };

// setTimeout(() => {
//     console.log('2nd timer is done');
//     fetchData(text => {
//         console.log(text + ' WTF');
//     });
// }, 1500);

// //Can also be written as
// function fetchData(callback) {
//     setTimeout(function() {
//         callback('Hello');
//     }, 1500);
// }

// function callback_fn(text) {
//     console.log(text + 'Wtf');
// }
// setTimeout(function() {
//     console.log('2nd timer done');
//     fetchData(callback_fn);
// }, 1500);

//Promises
//Syntax for creating a promise
//Promise constructor fn takes a callback. The callback has 2 params, resolve and reject.
//1st one resolves the promise successfully, 2nd one rejects it(like throwing an error)
//const promise = new Promise((resolve, reject) => {}); OR Promise(callback_with_2_params)

//creating Promise
const fetchData = () => {
	const promise = new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve("HIII this is THE resolve");
		}, 1500);
	});
	return promise; //synchronous code, so it'll be returned immediately before the code in the promise is run, which will happen sometime later
};

setTimeout(() => {
	console.log("Timer is done");
	//then is callable on a promise, and inside then we include a callback, which will execute after promise has resolved, and the resolve is passed into the callback
	fetchData()
		.then((resolve_recvd) => {
			console.log(resolve_recvd);
			return fetchData(); //returns a promise
		}) //resolve is returned but we didnt accept it in this then block
		.then(() => fetchData()) //resolve returned and accepted below
		.then((agn_agn) => {
			console.log(agn_agn);
		});
}, 1500);

//VERY CONFUSING
