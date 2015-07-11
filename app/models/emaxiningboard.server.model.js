'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Emaxiningboard Schema
 */
var EmaxiningboardSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Emaxiningboard name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

module.exports = EmaxiningboardSchema;