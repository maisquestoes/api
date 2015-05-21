'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../../server'),
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
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Emaxiningboard
				agent.post('/emaxiningboards')
					.send(emaxiningboard)
					.expect(200)
					.end(function(emaxiningboardSaveErr, emaxiningboardSaveRes) {
						// Handle Emaxiningboard save error
						if (emaxiningboardSaveErr) done(emaxiningboardSaveErr);

						// Get a list of Emaxiningboards
						agent.get('/emaxiningboards')
							.end(function(emaxiningboardsGetErr, emaxiningboardsGetRes) {
								// Handle Emaxiningboard save error
								if (emaxiningboardsGetErr) done(emaxiningboardsGetErr);

								// Get Emaxiningboards list
								var emaxiningboards = emaxiningboardsGetRes.body;

								// Set assertions
								(emaxiningboards[0].user._id).should.equal(userId);
								(emaxiningboards[0].name).should.match('Emaxiningboard Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Emaxiningboard instance if not logged in', function(done) {
		agent.post('/emaxiningboards')
			.send(emaxiningboard)
			.expect(401)
			.end(function(emaxiningboardSaveErr, emaxiningboardSaveRes) {
				// Call the assertion callback
				done(emaxiningboardSaveErr);
			});
	});

	it('should not be able to save Emaxiningboard instance if no name is provided', function(done) {
		// Invalidate name field
		emaxiningboard.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Emaxiningboard
				agent.post('/emaxiningboards')
					.send(emaxiningboard)
					.expect(400)
					.end(function(emaxiningboardSaveErr, emaxiningboardSaveRes) {
						// Set message assertion
						(emaxiningboardSaveRes.body.message).should.match('Please fill Emaxiningboard name');
						
						// Handle Emaxiningboard save error
						done(emaxiningboardSaveErr);
					});
			});
	});

	it('should be able to update Emaxiningboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Emaxiningboard
				agent.post('/emaxiningboards')
					.send(emaxiningboard)
					.expect(200)
					.end(function(emaxiningboardSaveErr, emaxiningboardSaveRes) {
						// Handle Emaxiningboard save error
						if (emaxiningboardSaveErr) done(emaxiningboardSaveErr);

						// Update Emaxiningboard name
						emaxiningboard.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Emaxiningboard
						agent.put('/emaxiningboards/' + emaxiningboardSaveRes.body._id)
							.send(emaxiningboard)
							.expect(200)
							.end(function(emaxiningboardUpdateErr, emaxiningboardUpdateRes) {
								// Handle Emaxiningboard update error
								if (emaxiningboardUpdateErr) done(emaxiningboardUpdateErr);

								// Set assertions
								(emaxiningboardUpdateRes.body._id).should.equal(emaxiningboardSaveRes.body._id);
								(emaxiningboardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Emaxiningboards if not signed in', function(done) {
		// Create new Emaxiningboard model instance
		var emaxiningboardObj = new Emaxiningboard(emaxiningboard);

		// Save the Emaxiningboard
		emaxiningboardObj.save(function() {
			// Request Emaxiningboards
			request(app).get('/emaxiningboards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Emaxiningboard if not signed in', function(done) {
		// Create new Emaxiningboard model instance
		var emaxiningboardObj = new Emaxiningboard(emaxiningboard);

		// Save the Emaxiningboard
		emaxiningboardObj.save(function() {
			request(app).get('/emaxiningboards/' + emaxiningboardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', emaxiningboard.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Emaxiningboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Emaxiningboard
				agent.post('/emaxiningboards')
					.send(emaxiningboard)
					.expect(200)
					.end(function(emaxiningboardSaveErr, emaxiningboardSaveRes) {
						// Handle Emaxiningboard save error
						if (emaxiningboardSaveErr) done(emaxiningboardSaveErr);

						// Delete existing Emaxiningboard
						agent.delete('/emaxiningboards/' + emaxiningboardSaveRes.body._id)
							.send(emaxiningboard)
							.expect(200)
							.end(function(emaxiningboardDeleteErr, emaxiningboardDeleteRes) {
								// Handle Emaxiningboard error error
								if (emaxiningboardDeleteErr) done(emaxiningboardDeleteErr);

								// Set assertions
								(emaxiningboardDeleteRes.body._id).should.equal(emaxiningboardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Emaxiningboard instance if not signed in', function(done) {
		// Set Emaxiningboard user 
		emaxiningboard.user = user;

		// Create new Emaxiningboard model instance
		var emaxiningboardObj = new Emaxiningboard(emaxiningboard);

		// Save the Emaxiningboard
		emaxiningboardObj.save(function() {
			// Try deleting Emaxiningboard
			request(app).delete('/emaxiningboards/' + emaxiningboardObj._id)
			.expect(401)
			.end(function(emaxiningboardDeleteErr, emaxiningboardDeleteRes) {
				// Set message assertion
				(emaxiningboardDeleteRes.body.message).should.match('User is not logged in');

				// Handle Emaxiningboard error error
				done(emaxiningboardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Emaxiningboard.remove().exec();
		done();
	});
});