'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Role = mongoose.model('Role'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, role;

/**
 * Role routes tests
 */
describe('Role CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Role
		user.save(function() {
			role = {
				name: 'Role Name'
			};

			done();
		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Role.remove().exec();
		done();
	});
});