// C : Create
// R : Read
// U : Update
// D : Delete

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// get todos?complated=bool&q=description
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where
	}).then(function(todos) {
		if (!!todos) {
			res.json(todos);
		} else {
			res.status(404).send();
		}
	}).catch(function(e) {
		res.status(500).send(e);
	});


	// var filteredTodos = todos;

	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});
	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// }

	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(obj) {
	// 		return obj.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) >= 0;
	// 	});
	// }

	// // convert to JSON and send back to who called it
	// res.json(filteredTodos);
});

// get todo
app.get('/todos/:id', function(req, res) {
	// params in urls are returned as "strings"
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}).catch(function(e) {
		res.status(500).send(e);
	});


	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send();
	// }
});

// POST
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}).catch(function(e) {
		res.status(400).json(e);
	});

	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim();

	// // post increment
	// body.id = todoNextId++;
	// todos.push(body);

	// res.json(body);
});

// DELETE
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send();
		}
	}).catch(function() {
		res.status(500).send();
	});

	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedTodo) {
	// 	todos = _.without(todos, matchedTodo);
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).json({
	// 		"error": "No todo found with that id"
	// 	});
	// }
});

// PUT
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed')
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	// Model method
	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				// failure
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		// run if findById fails
		res.status(500).send();
	})

	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });
	// var body = _.pick(req.body, 'description', 'completed');
	// var validAttributes = {};

	// if (!matchedTodo) {
	// 	return res.status(404).send();
	// }

	// if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
	// 	validAttributes.completed = body.completed;
	// } else if (body.hasOwnProperty('completed')) {
	// 	return res.status(400).send();
	// } else {
	// 	// Never provided attribute, no problem here
	// }

	// if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
	// 	validAttributes.description = body.description;
	// } else if (body.hasOwnProperty('description')) {
	// 	return res.status(400).send();
	// }

	// // overwrite methods and properties
	// _.extend(matchedTodo, validAttributes);
	// res.json(matchedTodo);
});

// user POST
app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});
})

db.sequelize.sync({force: true}).then(function() {
	app.listen(PORT, function() {
		console.log('Listening on port ' + PORT + '!');
	});
});