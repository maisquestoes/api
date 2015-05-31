'use strict';

/**
 * Module dependencies.
 */
var server = require('../../server');
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Emaxiningboard = mongoose.model('Emaxiningboard');

/**
 * Globals
 */
var user, emaxiningboard;

/**
 * Unit tests
 */
describe('Emaxiningboard Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			emaxiningboard = new Emaxiningboard({
				name: 'Emaxiningboard Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return emaxiningboard.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			emaxiningboard.name = '';

			return emaxiningboard.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Emaxiningboard.remove().exec();
		User.remove().exec();

		done();
	});
});