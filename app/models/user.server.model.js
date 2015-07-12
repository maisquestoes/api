'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var _ = require('lodashim');

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
  return (password === '' || password.length >= 6);
};

var validateLength = function(string) {
  return (string.length >= 3);
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    validate: [validateLength, 'Length of first name must be greater than 2 characters'],
    required: 'Please fill the first name.'
  },
  lastName: {
    type: String,
    trim: true,
    validate: [validateLength, 'Length of last name must be greater than 2 characters'],
    required: 'Please fill the last name.'
  },
  email: {
    type: String,
    trim: true,
    unique: 'This email is already exists, please try again.',
    required: 'Please fill an email',
    match: [/.+\@.+\..+/, 'Please fill a valid email.']
  },
  username: {
    type: String,
    unique: 'The username must be unique.',
    validate: [validateLength, 'Length of username must be greater than 2 characters'],
    required: 'Please fill the username.',
    trim: true
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'The password must be greater than 6 characters.']
  },
  salt: {
    type: String
  },
  apikey: [{
    type: String,
    default: '',
    unique: 'The apikey must be unique',
  }],
  facebookUid: {
    type: String,
    default: ''
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin', 'professor']
    }],
    default: ['user']
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  verificationToken: { type: String, default: ''},
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {

  if (!this.apikey.length) {
    this.apikey.push(_.apikey());
  }
  
  if (!this.verificationToken) {
    this.verificationToken = _.apikey();
  }

  if (this.password && this.password.length > 6) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
  if (this.password === this.hashPassword(password)) {
    this.apikey = _.apikey();
    this.save();
    return true;
  }
  return false;
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var _this = this;
  var  possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function(err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Find by username and password
 */
UserSchema.statics.findUniqueByUsernameAndPassword = function(username, password, callback) {
  var _this = this;

  _this.find().where('username').equals(username).findOne(function(err, user) {
    if (!err) {
      if (user && user.authenticate(password)) {
        //user.password = undefined;
        //user.salt = undefined;
        callback(err, user);
      }
    } else {
      callback(err);
    }
  });
};

/**
 * Find by apikey
 */
UserSchema.statics.findUniqueByApikey = function(apikey, callback) {
  this.findOne({
    apikey: apikey
  }, function(err, user) {
    if (!err) {
      //user.password = undefined;
      //user.salt = undefined;
      callback(err, user);
    } else {
      callback(err);
    }
  });
};

module.exports = UserSchema;
