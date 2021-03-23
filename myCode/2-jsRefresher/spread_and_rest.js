//Spread Operator
const Person = {
    name: 'Shubham',
    age: '20',
    greet() {
        console.log(`I am ${this.name}`);
    }
};
const CopiedPerson = { ...Person };
console.log(CopiedPerson);

const hobbies = ['Lala', 'Lulu'];
const copiedHobbies = [...hobbies];
console.log(copiedHobbies);

//Rest Operator

// const toArray = (a1, a2, a3) => {
//     return [a1, a2, a3];
// }
// console.log(toArray(1, 2, 3, 4))
const toArray = (...args) => {
    return args;
}
console.log(toArray(1, 2, 3, 4));