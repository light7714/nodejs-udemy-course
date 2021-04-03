const Person = {
    name: 'Shubham',
    age: '20',
    greet() {
        console.log(`I am ${this.name}`);
    }
};

// const printName = (PersonData) => {
//     console.log(`Hi I am ${PersonData.name}`);
// };
// printName(Person);

//Object destructuring
//we pulled only the name and age property of the object passed to us using { property } inside arg list
const printName = ({ name, age }) => {
    console.log(`Hi I am ${name} and my age is ${age}`);
};
printName(Person);

//need to use same name as object property (name and age)
const { name, age } = Person;
console.log(name, age);

//Array destructuring
const hobbies = ['fadf', 'fassdg'];
//any name can be used to pull out
const [h1, h2] = hobbies;
console.log(h1, h2);
