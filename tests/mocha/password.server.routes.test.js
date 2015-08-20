'use strict';

var server = require('../../server');
var should = require('should');
var request = require('supertest');
var agent = request(server);
var mongoose = require('mongoose');
var credentials, user;

describe('User password routes tests', function() {

  before(function(done) {

    mongoose.connection.db.dropDatabase(function () {
      credentials = {
        username: 'username0',
        password: 'password0'
      };

      user = {
        name: 'Full2',
        email: 'test@test.com',
        username: credentials.username,
        password: credentials.password
      };

      done();

    });
  });


  it('should be able to recover password by email', function(done) {
    agent.post('/auth/signup')
    .send(user)
    .end(function() {
      agent.post('/auth/forgot')
      .send({ email: user.email })
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        done();
      });
    });
  });

  afterEach(function(done) {
    done();
  });
});
