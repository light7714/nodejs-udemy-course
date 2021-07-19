//mocha-> running our tests, chai-> defines a success condition

//*can also use should function (see more)
const expect = require('chai').expect;

//simply write a test by it() (given by mocha)
//1st arg is title for test, should write in plain english, 2nd arg is test code
it('should add numbers correctly', function () {
	const num1 = 2;
	const num2 = 3;
	//pass the result u wanna test inside expect(), pass the value u expect the test to be equal to inside equal()
	expect(num1 + num2).to.equal(5);
});

it('should not give 6', function () {
	const num1 = 2;
	const num2 = 3;
	//not.to and to.not both working..
	expect(num1 + num2).not.to.equal(6);
});
