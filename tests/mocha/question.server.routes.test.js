'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Question = mongoose.model('Question'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, question;

/**
 * Question routes tests
 */
describe('Question CRUD tests', function() {
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

		// Save a user to the test db and create new Question
		user.save(function() {
			question = {
				query: 'Quem descobriu o brasil?',
				awnsers: [{
						description:'Pedro alvares cabral.',
						correct: true
					},{
						description:'xuxa',
						correct: false
					}]
			};
			done();
		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Question.remove().exec();
		done();
	});
});