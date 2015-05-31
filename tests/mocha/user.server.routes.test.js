'use strict';

var server = require('../../server');
var should = require('should');
var request = require('supertest');
var agent = request(server);
var mongoose = require('mongoose');
var credentials, user;

describe('Subject CRUD tests', function() {


	before(function(done) {
			mongoose.connection.db.dropDatabase(function () {

				// Create user credentials
				credentials = {
					username: 'username2',
					password: 'password2'
				};

				// Create a new user
				user = {
					firstName: 'Full2',
					lastName: 'Name2',
					email: 'test2@test.com',
					username: credentials.username,
					password: credentials.password
				};

				done();

			});
	});

	it('should be able to create a new user by email', function(done) {
		agent.post('/auth/signup')
			.send(user)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				// Handle signin error
				if (err) done(err);

				done();
			});
	});

	afterEach(function(done) {
		done();
	});
});