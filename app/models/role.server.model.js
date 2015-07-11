'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Role Schema
 */
var RoleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Role name',
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

module.exports = RoleSchema;