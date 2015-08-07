'use strict';

/**
 * Module dependencies.
 */
require('../../server');
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Subject = mongoose.model('Subject');

/**
 * Globals
 */
var user, subject;

/**
 * Unit tests
 */
describe('Subject Model Unit Tests:', function() {
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
      subject = new Subject({
        subject: 'Subject Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return subject.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      subject.subject = '';

      return subject.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Subject.remove().exec();
    User.remove().exec();

    done();
  });
});
