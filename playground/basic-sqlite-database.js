var Sequelize = require('Sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: 'sqlite',
	storage: __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 255]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({
	// force: true
}).then(function() {
	console.log('Everything is synced');

	Todo.findById(1).then(function (todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Todo not found');
		}
	});

	// Todo.create({
	// 	description: 'Be amazing'
	// }).then(function (todo) {
	// 	return Todo.create({
	// 		description: 'Clean office'
	// 	});
	// }).then(function () {
	// 	// return Todo.findById(1)
	// 	return Todo.findAll({
	// 		where: {
	// 			description: {
	// 				$like: '%ice%'
	// 			}
	// 		}
	// 	});
	// }).then(function (todos) {
	// 	if (todos) {
	// 		for (var i in todos) {
	// 			console.log(todos[i].toJSON());
	// 		}
	// 	} else {
	// 		console.log('No todos found');
	// 	}
	// }).catch(function (e) {
	// 	console.log(e);
	// });
});