const sum = (a, b) => {
	//if user passes only 1 arg, then a NaN will be given as o/p, but we wanna return a technical error object
	//rn we dont handle the error (like many times, when browser keeps loading and nothing happens), just throw it, so the application crashes
	if (a && b) {
		return a + b;
	}
	throw new Error('Invalid arguments');
};

//for sync code, we can handle errors by try catch
try {
	console.log(sum(1));
} catch (error) {
    //now the program doesnt crash when an error is throw in fn, its caught here, so its handled here
	console.log('Error occured');
    // console.log(error);
}

//if err is unhandled, this wouldnt get printed
console.log('This works!');

//in async code, errors are handled with then and catch. catch collects all errs thrown by any attached then blocks.