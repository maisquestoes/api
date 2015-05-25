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

	it('should be able to save Subject instance if logged in', function(done) {
		// TODO
		done();
	});

	it('should not be able to save Subject instance if not logged in', function(done) {
		// TODO
		done();
	});

	it('should not be able to save Subject instance if no name is provided', function(done) {
		// TODO
		done();
	});

	it('should be able to update Subject instance if signed in', function(done) {
		// TODO
		done();
	});

	it('should be able to get a list of Subjects if not signed in', function(done) {
		// TODO
		done();
	});


	it('should be able to get a single Subject if not signed in', function(done) {
		// TODO
		done();
	});

	it('should be able to delete Subject instance if signed in', function(done) {
		// TODO
		done();
	});

	it('should not be able to delete Subject instance if not signed in', function(done) {
		// TODO
		done();
	});

	afterEach(function(done) {
		User.remove().exec();
		Subject.remove().exec();
		done();
	});
});