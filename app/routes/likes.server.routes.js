'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var likes = require('../../app/controllers/likes.server.controller');

	// Likes Routes
	app.route('/likes')
		.get(likes.list)
		.post(users.requiresLogin, likes.create);

	app.route('/likes/:likeId')
		.get(likes.read)
		.put(users.requiresLogin, likes.hasAuthorization, likes.update)
		.delete(users.requiresLogin, likes.hasAuthorization, likes.delete);

	// Finish by binding the Like middleware
	app.param('likeId', likes.likeByID);
};
