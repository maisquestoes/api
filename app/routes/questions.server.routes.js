'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var questions = require('../../app/controllers/questions.server.controller');

	// Questions Routes
	app.route('/questions')
		.get(questions.list)
		.post(users.requiresLogin, questions.create);

	app.route('/questions/:questionId')
		.get(questions.read)
		.put(users.requiresLogin, questions.hasAuthorization, questions.update)
		.delete(users.requiresLogin, questions.hasAuthorization, questions.delete);

	// Finish by binding the Question middleware
	app.param('questionId', questions.questionByID);
};
