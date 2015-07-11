'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var EmaxiningboardSchema = require('../models/emaxiningboard.server.model');
var Emaxiningboard = mongoose.model('Emaxiningboard', EmaxiningboardSchema);
var _ = require('lodashim');

/**
 * Create a Emaxiningboard
 */
exports.create = function(req, res) {
	var emaxiningboard = new Emaxiningboard(req.body);
	emaxiningboard.user = req.user;

	emaxiningboard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emaxiningboard);
		}
	});
};

/**
 * Show the current Emaxiningboard
 */
exports.read = function(req, res) {
	res.jsonp(req.emaxiningboard);
};

/**
 * Update a Emaxiningboard
 */
exports.update = function(req, res) {
	var emaxiningboard = req.emaxiningboard ;

	emaxiningboard = _.extend(emaxiningboard , req.body);

	emaxiningboard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emaxiningboard);
		}
	});
};

/**
 * Delete an Emaxiningboard
 */
exports.delete = function(req, res) {
	var emaxiningboard = req.emaxiningboard ;

	emaxiningboard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emaxiningboard);
		}
	});
};

/**
 * List of Emaxiningboards
 */
exports.list = function(req, res) { 
	Emaxiningboard.find().sort('-created').populate('user', 'displayName').exec(function(err, emaxiningboards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emaxiningboards);
		}
	});
};

/**
 * Emaxiningboard middleware
 */
exports.emaxiningboardByID = function(req, res, next, id) { 
	Emaxiningboard.findById(id).populate('user', 'displayName').exec(function(err, emaxiningboard) {
		if (err) { return next(err); }
		if (! emaxiningboard) { return next(new Error('Failed to load Emaxiningboard ' + id)); }
		req.emaxiningboard = emaxiningboard ;
		next();
	});
};

/**
 * Emaxiningboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.emaxiningboard.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
