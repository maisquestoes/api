'use strict';

/**
 * Module dependencies.
 */

var server = require('../../server');
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var CompanySchema = require('../../app/models/company.server.model');
var Company = mongoose.model('Company', CompanySchema);

/**
 * Globals
 */
var user, company;

/**
 * Unit tests
 */
describe('Company Model Unit Tests:', function() {
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
			company = new Company({
				name: 'Company Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return company.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			company.name = '';

			return company.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Company.remove().exec();
		User.remove().exec();

		done();
	});
});