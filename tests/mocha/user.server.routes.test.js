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
				should.not.exist(err);
				done();
			});
	});


	it('should be no able to signin without credentials', function(done) {
		agent.post('/auth/signin')
			.send({})
			.expect('Content-Type', /json/)
			.expect(401, done);
	});

	it('should be no able to signin with undefined username', function(done) {
		agent.post('/auth/signin')
			.send({username: undefined, password: 'password'})
			.expect('Content-Type', /json/)
			.expect(401, done);
	});

	it('should be no able to signin with wrong username', function(done) {
		agent.post('/auth/signin')
			.send({username: 'username', password: 'password'})
			.expect('Content-Type', /json/)
			.expect(401, done);
	});

	it('should be no able to signin with wrong password', function(done) {
		agent.post('/auth/signin')
			.send({username: 'username2', password: 'password'})
			.expect('Content-Type', /json/)
			.expect(401, done);
	});

	it('should be able to signin by email and password', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				should.not.exist(err);
		  	var res = res.body.o;
				res.should.have.property('displayName', 'Full2 Name2');
				res.should.have.property('apikey');
				res.should.have.property('email', 'test2@test.com');
				res.should.have.property('roles', ['user']);
				user.apikey = res.apikey;
				done();
			});
	});

	it('should not be able to signout without apikey', function(done) {
		agent.get('/auth/signout')
			.send()
			.expect('Content-Type', /json/)
			.expect(403, done());
	});

	it('should be able to signout', function(done) {
		agent.get('/auth/signout')
			.send()
      .set('apikey', user.apikey)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				should.not.exist(err);
			  should.exist(res);
				done();
			});
	});

	it('should not be able to signout with same apikey', function(done) {
		agent.get('/auth/signout')
			.send()
      .set('apikey', user.apikey)
			.expect('Content-Type', /json/)
			.expect(403, done);
	});

	afterEach(function(done) {
		done();
	});
});