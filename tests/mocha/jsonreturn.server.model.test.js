'use strict';

/**
 * Module dependencies.
 */
var server = require('../../server');
var should = require('should'),
	JsonReturn = require('../../app/models/jsonreturn.server.model');
/**
 * Globals
 */
 var jsonReturn;

/**
 * Unit tests
 */
describe('JsonReturn tests:', function() {
	describe('Method constructor', function() {
		it('should be instatiated empty without problems', function(done) {
			jsonReturn = new JsonReturn();
			jsonReturn.should.have.property('m', '');
			jsonReturn.should.have.property('o', {});
			jsonReturn.should.have.property('s', 0);
			done();
		});

		it('should extend a return with param passed by constructor', function(done) {
			jsonReturn = new JsonReturn('test',1);
			jsonReturn.should.have.property('m', 'test');
			jsonReturn.should.have.property('o', {});
			jsonReturn.should.have.property('s', 1);
			done();
		});

		it('should extend a message property passing string in a param', function(done) {
			jsonReturn = new JsonReturn('test');
			jsonReturn.should.have.property('m', 'test');
			done();
		});

		it('should extend a status property passing integer in a param', function(done) {
			jsonReturn = new JsonReturn(1);
			jsonReturn.should.have.property('s', 1);
			done();
		});

		it('should be instantiated without calling new', function(done) {
			jsonReturn = new JsonReturn('test', {obj:1}, 1);
			jsonReturn.should.have.property('m', 'test');
			jsonReturn.should.have.property('o', {obj:1});
			jsonReturn.should.have.property('s', 1);
			done();
		});

		it('should have default message to error and success status', function(done) {
			jsonReturn = new JsonReturn(1);
			jsonReturn.should.have.property('m', 'Ação realizada com sucesso.');

			jsonReturn = new JsonReturn(-1);
			jsonReturn.should.have.property('m', 'Ocorreu um erro: -1');

			done();
		});
	});
});