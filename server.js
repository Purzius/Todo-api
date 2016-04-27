var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Do laundry',
	completed: false
}, {
	id: 2,
	description: 'Go get strong',
	completed: false
}, {
	id: 3,
	description: 'Look amazing',
	completed: true
}];

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
	// convert to JSON and send back to who called it
	res.json(todos);
});

app.get('/todos/:id', function (req, res) {
	// params in urls are returned as "strings"
	var todoId = parseInt(req.params.id, 10);

	for (var i in todos) {
		if (todos[i].id === todoId) {
			res.json(todos[i]);
			return;
		}
	}

	res.status(404).send();
});

app.listen(PORT, function () {
	console.log('Listening on port ' + PORT + '!');
});