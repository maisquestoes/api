'use strict';

var server = require('../../server');
var should = require('should');
var request = require('supertest');
var agent = request(server);

describe('Subject CRUD tests', function() {

	it('should be return 200 on get default route', function(done) {
		agent.get('/')
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should be return content in portuguese', function(done) {
		agent.get('/')
			.set('Accept-language', 'pt-BR')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
		    if (err) throw err;
		    res.body.should.have.property('m', 'Estamos contratando');
		    done();
		  });
	});

	it('should be return content in english', function(done) {
		agent.get('/')
			.set('Accept-language', 'en-US')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
		    if (err) throw err;
		    res.body.should.have.property('m', 'We are hiring');
		    done();
		  });
	});

	afterEach(function(done) {
		done();
	});
});