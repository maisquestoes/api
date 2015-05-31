/*jshint expr: true*/
'use strict';

/**
 * Module dependencies.
 */
var server = require('../../server');
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2, user3, user4, apikey;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user3 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test3@test.com',
			username: 'username3',
			password: 'password3',
			provider: 'local'
		});
		user4 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test4@test.com',
			username: 'username4',
			password: 'password4',
			provider: 'local'
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should generate apikey on save', function(done) {
			user.save(function (err) {
				user.apikey.map(function (apikey) {
					if (apikey.length === 22) {
						done();
					}
					return apikey;
				});
			});
			
		});


		it('should be authenticated', function(done) {
			user3.save(function (err) {
				if(!err) {
					user3.authenticate('password3').should.be.exactly(true);
					done();
				}
			});
		});

		it('should login by username and password', function(done) {
			user4.save(function(err) {
				if (!err) {
					User.findUniqueByUsernameAndPassword('username4', 'password4', function(err, user) {
						if (user) {
							done();
						} else {
							should.not.ok;
						}
					});
				}	
			});
			
		});


		it('should generate new apikey on login by username', function(done) {

			var user = new User({
				firstName: 'Full',
				lastName: 'Name',
				displayName: 'Full Name',
				email: 'test@test.com',
				username: 'username5',
				password: 'password5',
				provider: 'local'
			});
			user.save(function() {
				apikey = user.apikey;

				User.findUniqueByUsernameAndPassword('username5', 'password5', function(err, user) {
					if (user) {
						user.apikey.should.not.equal(apikey);
						apikey = user.apikey; //to be used in next test
						done();
					}
				});
			});
			
		});

		it('should login by apikey', function(done) {
			User.findUniqueByApikey(apikey, function(err, user) {
				if (user) {
					done();
				}
			});
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});