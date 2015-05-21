'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../../server'),
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
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Company
				agent.post('/companies')
					.send(company)
					.expect(200)
					.end(function(companySaveErr, companySaveRes) {
						// Handle Company save error
						if (companySaveErr) done(companySaveErr);

						// Get a list of Companies
						agent.get('/companies')
							.end(function(companiesGetErr, companiesGetRes) {
								// Handle Company save error
								if (companiesGetErr) done(companiesGetErr);

								// Get Companies list
								var companies = companiesGetRes.body;

								// Set assertions
								(companies[0].user._id).should.equal(userId);
								(companies[0].name).should.match('Company Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Company instance if not logged in', function(done) {
		agent.post('/companies')
			.send(company)
			.expect(401)
			.end(function(companySaveErr, companySaveRes) {
				// Call the assertion callback
				done(companySaveErr);
			});
	});

	it('should not be able to save Company instance if no name is provided', function(done) {
		// Invalidate name field
		company.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Company
				agent.post('/companies')
					.send(company)
					.expect(400)
					.end(function(companySaveErr, companySaveRes) {
						// Set message assertion
						(companySaveRes.body.message).should.match('Please fill Company name');
						
						// Handle Company save error
						done(companySaveErr);
					});
			});
	});

	it('should be able to update Company instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Company
				agent.post('/companies')
					.send(company)
					.expect(200)
					.end(function(companySaveErr, companySaveRes) {
						// Handle Company save error
						if (companySaveErr) done(companySaveErr);

						// Update Company name
						company.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Company
						agent.put('/companies/' + companySaveRes.body._id)
							.send(company)
							.expect(200)
							.end(function(companyUpdateErr, companyUpdateRes) {
								// Handle Company update error
								if (companyUpdateErr) done(companyUpdateErr);

								// Set assertions
								(companyUpdateRes.body._id).should.equal(companySaveRes.body._id);
								(companyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Companies if not signed in', function(done) {
		// Create new Company model instance
		var companyObj = new Company(company);

		// Save the Company
		companyObj.save(function() {
			// Request Companies
			request(app).get('/companies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Company if not signed in', function(done) {
		// Create new Company model instance
		var companyObj = new Company(company);

		// Save the Company
		companyObj.save(function() {
			request(app).get('/companies/' + companyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', company.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Company instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Company
				agent.post('/companies')
					.send(company)
					.expect(200)
					.end(function(companySaveErr, companySaveRes) {
						// Handle Company save error
						if (companySaveErr) done(companySaveErr);

						// Delete existing Company
						agent.delete('/companies/' + companySaveRes.body._id)
							.send(company)
							.expect(200)
							.end(function(companyDeleteErr, companyDeleteRes) {
								// Handle Company error error
								if (companyDeleteErr) done(companyDeleteErr);

								// Set assertions
								(companyDeleteRes.body._id).should.equal(companySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Company instance if not signed in', function(done) {
		// Set Company user 
		company.user = user;

		// Create new Company model instance
		var companyObj = new Company(company);

		// Save the Company
		companyObj.save(function() {
			// Try deleting Company
			request(app).delete('/companies/' + companyObj._id)
			.expect(401)
			.end(function(companyDeleteErr, companyDeleteRes) {
				// Set message assertion
				(companyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Company error error
				done(companyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Company.remove().exec();
		done();
	});
});