'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
  query: {
    type: String,
    trim: true,
    required: 'Insira o enunciado da questão.'
  },
  answers: [{
    description: {
      type: String,
      trim: true,
      required: 'Insira a alternativa corretamente.'
    },
    correct: {
      type: Boolean,
      default: false
    }
  }],
  text: {
    type: String,
    trim: true
  },
  like: {
    type: Schema.ObjectId,
    ref: 'Like'
  },
  hits: {
    type: Number,
    validate: validators.isInt(),
    default: 0 
  },
  miss: {
    type: Number,
    validate: validators.isInt(),
    default: 0 
  },
  type: {
    type: String,
    enum: ['objective', 'subjective'],
    default: 'objective'
  },
  subject: {
    type: Schema.ObjectId,
    ref: 'Subject'
  },
  role: {
    type: Schema.ObjectId,
    ref: 'Role'
  },
  company: {
    type: Schema.ObjectId,
    ref: 'Company'
  },
  examiningBoard: {
    type: Schema.ObjectId,
    ref: 'ExaminingBoard'
  },
  time: {
    avg: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    like: {
      type: Schema.ObjectId,
      ref: 'Like'
    }
  }],
  active: {
    type: Boolean,
    default: true
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

module.exports = QuestionSchema;
