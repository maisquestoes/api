'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var mongoose = require('mongoose');
var UserSchema = require('../../models/user.server.model');
var User = mongoose.model('User', UserSchema);
var passport = require('passport');
var JsonReturn = require('../../models/jsonreturn.server.model');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) { return next(err); }
		if (!user) { return next(new Error('Failed to load User ' + id)); }
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * Require apikey routing middleware
 */
exports.requiresApikey = function(req, res, next) {
	passport.authenticate('localapikey', { failureRedirect: '/api/unauthorized' })(req, res, next);
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};

/**
 * When doesn't have autorization
 */
exports.unauthorized = function(req, res) {
	var jsonReturn = new JsonReturn();
	jsonReturn.s = -1;
	jsonReturn.m = 'Não possui autorização para acessar este método';

	res.json(jsonReturn);
};