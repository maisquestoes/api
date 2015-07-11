'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var RoleSchema = require('../models/role.server.model');
var Role = mongoose.model('Role', RoleSchema);
var _ = require('lodashim');

/**
 * Create a Role
 */
exports.create = function(req, res) {
	var role = new Role(req.body);
	role.user = req.user;

	role.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(role);
		}
	});
};

/**
 * Show the current Role
 */
exports.read = function(req, res) {
	res.jsonp(req.role);
};

/**
 * Update a Role
 */
exports.update = function(req, res) {
	var role = req.role ;

	role = _.extend(role , req.body);

	role.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(role);
		}
	});
};

/**
 * Delete an Role
 */
exports.delete = function(req, res) {
	var role = req.role ;

	role.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(role);
		}
	});
};

/**
 * List of Roles
 */
exports.list = function(req, res) { 
	Role.find().sort('-created').populate('user', 'displayName').exec(function(err, roles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roles);
		}
	});
};

/**
 * Role middleware
 */
exports.roleByID = function(req, res, next, id) { 
	Role.findById(id).populate('user', 'displayName').exec(function(err, role) {
		if (err) { return next(err); }
		if (! role) { return next(new Error('Failed to load Role ' + id)); }
		req.role = role ;
		next();
	});
};

/**
 * Role authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.role.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
