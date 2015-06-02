'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var mongoose = require('mongoose');
var UserSchema = require('../../models/user.server.model');
var User = mongoose.model('User', UserSchema);
var passport = require('passport');

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
 * Require apikey routing middleware
 */
exports.requiresApikey = function(req, res, next) {
	passport.authenticate('apikey', function(err, user) {
		if (err) {
			res.status(500).jsonp('Error trying to autenticate by apikey');
		} else if (!user) {
			res.status(403).jsonp('User is not authenticated');
		} else {
			req.user = user;
			next();
		}
	})(req, res, next);
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
				return res.status(403).jsonp('User is not authorized');
			}
		});
	};
};