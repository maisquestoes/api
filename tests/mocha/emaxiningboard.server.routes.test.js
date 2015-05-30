'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Emaxiningboard = mongoose.model('Emaxiningboard'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, emaxiningboard;

/**
 * Emaxiningboard routes tests
 */
describe('Emaxiningboard CRUD tests', function() {
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

		// Save a user to the test db and create new Emaxiningboard
		user.save(function() {
			emaxiningboard = {
				name: 'Emaxiningboard Name'
			};

			done();
		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Emaxiningboard.remove().exec();
		done();
	});
});