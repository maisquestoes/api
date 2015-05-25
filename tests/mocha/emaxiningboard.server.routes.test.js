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

	it('should be able to save Emaxiningboard instance if logged in', function(done) {
		// TODO
		done();
	});

	it('should not be able to save Emaxiningboard instance if not logged in', function(done) {
		// TODO
		done();
	});

	it('should not be able to save Emaxiningboard instance if no name is provided', function(done) {
		// TODO
		done();
	});

	it('should be able to update Emaxiningboard instance if signed in', function(done) {
		// TODO
		done();
	});

	it('should be able to get a list of Emaxiningboards if not signed in', function(done) {
		// TODO
		done();
	});


	it('should be able to get a single Emaxiningboard if not signed in', function(done) {
		// TODO
		done();
	});

	it('should be able to delete Emaxiningboard instance if signed in', function(done) {
		// TODO
		done();
	});

	it('should not be able to delete Emaxiningboard instance if not signed in', function(done) {
		// TODO
		done();
	});

	afterEach(function(done) {
		User.remove().exec();
		Emaxiningboard.remove().exec();
		done();
	});
});