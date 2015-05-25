'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Company = mongoose.model('Company'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, company;

/**
 * Company routes tests
 */
describe('Company CRUD tests', function() {
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

		// Save a user to the test db and create new Company
		user.save(function() {
			company = {
				name: 'Company Name'
			};

			done();
		});
	});

	it('should be able to save Company instance if logged in', function(done) {
		// TODO
		done();
	});

	it('should not be able to save Company instance if not logged in', function(done) {
		// TODO
		done();
	});

	it('should not be able to save Company instance if no name is provided', function(done) {
		// TODO
		done();
	});

	it('should be able to update Company instance if signed in', function(done) {
		// TODO
		done();
	});

	it('should be able to get a list of Companies if not signed in', function(done) {
		// TODO
		done();
	});


	it('should be able to get a single Company if not signed in', function(done) {
		// TODO
		done();
	});

	it('should be able to delete Company instance if signed in', function(done) {
		// TODO
		done();
	});

	it('should not be able to delete Company instance if not signed in', function(done) {
		// TODO
		done();
	});

	afterEach(function(done) {
		User.remove().exec();
		Company.remove().exec();
		done();
	});
});