'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var roles = require('../../app/controllers/roles.server.controller');

	// Roles Routes
	app.route('/roles')
		.get(roles.list)
		.post(users.requiresApikey, roles.create);

	app.route('/roles/:roleId')
		.get(roles.read)
		.put(users.requiresApikey, roles.hasAuthorization, roles.update)
		.delete(users.requiresApikey, roles.hasAuthorization, roles.delete);

	// Finish by binding the Role middleware
	app.param('roleId', roles.roleByID);
};
