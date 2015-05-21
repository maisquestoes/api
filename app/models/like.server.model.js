'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Like Schema
 */
var LikeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Like name',
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

module.exports = LikeSchema;