'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Subject = mongoose.model('Subject'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, subject;

/**
 * Subject routes tests
 */
describe('Subject CRUD tests', function() {
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

		// Save a user to the test db and create new Subject
		user.save(function() {
			subject = {
				name: 'Subject Name'
			};

			done();
		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Subject.remove().exec();
		done();
	});
});