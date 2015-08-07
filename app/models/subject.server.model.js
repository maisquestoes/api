'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
  subject: {
    type: String,
    default: '',
    required: 'Please fill Subject name',
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

module.exports = SubjectSchema;
