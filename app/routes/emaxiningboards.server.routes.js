'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var emaxiningboards = require('../../app/controllers/emaxiningboards.server.controller');

	// Emaxiningboards Routes
	app.route('/emaxiningboards')
		.get(emaxiningboards.list)
		.post(users.requiresLogin, emaxiningboards.create);

	app.route('/emaxiningboards/:emaxiningboardId')
		.get(emaxiningboards.read)
		.put(users.requiresLogin, emaxiningboards.hasAuthorization, emaxiningboards.update)
		.delete(users.requiresLogin, emaxiningboards.hasAuthorization, emaxiningboards.delete);

	// Finish by binding the Emaxiningboard middleware
	app.param('emaxiningboardId', emaxiningboards.emaxiningboardByID);
};
