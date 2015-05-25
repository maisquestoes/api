'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Like = mongoose.model('Like'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, like;

/**
 * Like routes tests
 */
describe('Like CRUD tests', function() {
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

		// Save a user to the test db and create new Like
		user.save(function() {
			like = {
				name: 'Like Name'
			};

			done();
		});
	});

	it('should be able to save Like instance if logged in', function(done) {
		// TODO
		done();
	});

	it('should not be able to save Like instance if not logged in', function(done) {
		// TODO
		done();
	});

	it('should not be able to save Like instance if no name is provided', function(done) {
		// TODO
		done();
	});

	it('should be able to update Like instance if signed in', function(done) {
		// TODO
		done();
	});

	it('should be able to get a list of Likes if not signed in', function(done) {
		// Create new Like model instance
		var likeObj = new Like(like);

		// Save the Like
		likeObj.save(function() {
			// Request Likes
			request(app).get('/likes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Like if not signed in', function(done) {
		// TODO
		done();
	});

	it('should be able to delete Like instance if signed in', function(done) {
		// TODO
		done();
	});

	it('should not be able to delete Like instance if not signed in', function(done) {
		// TODO
		done();
	});

	afterEach(function(done) {
		User.remove().exec();
		Like.remove().exec();
		done();
	});
});