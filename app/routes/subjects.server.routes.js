'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var subjects = require('../../app/controllers/subjects.server.controller');

	// Subjects Routes
	app.route('/subjects')
		.get(subjects.list)
		.post(users.requiresApikey, subjects.create);

	app.route('/subjects/:subjectId')
		.get(subjects.read)
		.put(users.requiresApikey, subjects.hasAuthorization, subjects.update)
		.delete(users.requiresApikey, subjects.hasAuthorization, subjects.delete);

	app.route('/api/subject')
		.get(users.requiresApikey, subjects.listAll);

	// Finish by binding the Subject middleware
	app.param('subjectId', subjects.subjectByID);
};
