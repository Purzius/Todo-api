var person = {
	name: 'Mads',
	age: 21
};

function updatePerson(obj) {
	// obj = {
	// 	name: 'Mads',
	// 	age: 24
	// };
	obj.age = 24;
};

updatePerson(person);
console.log(person);

var grades = [15, 7];

function addGrade(array) {
	// array = [12, 33, 99];
	array.push(88);

	// nodejs
	debugger;
}

addGrade(grades);
console.log(grades);