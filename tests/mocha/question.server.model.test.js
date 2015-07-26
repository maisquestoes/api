'use strict';

/**
 * Module dependencies.
 */
require('../../server');
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Question = mongoose.model('Question');

/**
 * Globals
 */
var user, question;

/**
 * Unit tests
 */
describe('Question Model Unit Tests:', function() {
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
      question = new Question({
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      
      question.query = 'Quem descobriu o brasil?';

      question.awnsers = [{
        description:'Pedro alvares cabral.',
        correct: true
      },{
        description:'xuxa',
        correct: false
      }];

      return question.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      question.query = '';
      

      return question.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Question.remove().exec();
    User.remove().exec();

    done();
  });
});
