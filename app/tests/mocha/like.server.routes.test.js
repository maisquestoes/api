'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../../server'),
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
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Like
				agent.post('/likes')
					.send(like)
					.expect(200)
					.end(function(likeSaveErr, likeSaveRes) {
						// Handle Like save error
						if (likeSaveErr) done(likeSaveErr);

						// Get a list of Likes
						agent.get('/likes')
							.end(function(likesGetErr, likesGetRes) {
								// Handle Like save error
								if (likesGetErr) done(likesGetErr);

								// Get Likes list
								var likes = likesGetRes.body;

								// Set assertions
								(likes[0].user._id).should.equal(userId);
								(likes[0].name).should.match('Like Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Like instance if not logged in', function(done) {
		agent.post('/likes')
			.send(like)
			.expect(401)
			.end(function(likeSaveErr, likeSaveRes) {
				// Call the assertion callback
				done(likeSaveErr);
			});
	});

	it('should not be able to save Like instance if no name is provided', function(done) {
		// Invalidate name field
		like.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Like
				agent.post('/likes')
					.send(like)
					.expect(400)
					.end(function(likeSaveErr, likeSaveRes) {
						// Set message assertion
						(likeSaveRes.body.message).should.match('Please fill Like name');
						
						// Handle Like save error
						done(likeSaveErr);
					});
			});
	});

	it('should be able to update Like instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Like
				agent.post('/likes')
					.send(like)
					.expect(200)
					.end(function(likeSaveErr, likeSaveRes) {
						// Handle Like save error
						if (likeSaveErr) done(likeSaveErr);

						// Update Like name
						like.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Like
						agent.put('/likes/' + likeSaveRes.body._id)
							.send(like)
							.expect(200)
							.end(function(likeUpdateErr, likeUpdateRes) {
								// Handle Like update error
								if (likeUpdateErr) done(likeUpdateErr);

								// Set assertions
								(likeUpdateRes.body._id).should.equal(likeSaveRes.body._id);
								(likeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
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
		// Create new Like model instance
		var likeObj = new Like(like);

		// Save the Like
		likeObj.save(function() {
			request(app).get('/likes/' + likeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', like.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Like instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Like
				agent.post('/likes')
					.send(like)
					.expect(200)
					.end(function(likeSaveErr, likeSaveRes) {
						// Handle Like save error
						if (likeSaveErr) done(likeSaveErr);

						// Delete existing Like
						agent.delete('/likes/' + likeSaveRes.body._id)
							.send(like)
							.expect(200)
							.end(function(likeDeleteErr, likeDeleteRes) {
								// Handle Like error error
								if (likeDeleteErr) done(likeDeleteErr);

								// Set assertions
								(likeDeleteRes.body._id).should.equal(likeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Like instance if not signed in', function(done) {
		// Set Like user 
		like.user = user;

		// Create new Like model instance
		var likeObj = new Like(like);

		// Save the Like
		likeObj.save(function() {
			// Try deleting Like
			request(app).delete('/likes/' + likeObj._id)
			.expect(401)
			.end(function(likeDeleteErr, likeDeleteRes) {
				// Set message assertion
				(likeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Like error error
				done(likeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Like.remove().exec();
		done();
	});
});