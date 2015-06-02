'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
var APIKeyStrategy = require('passport-apikey').Strategy;
var User = require('mongoose').model('User');

module.exports = function() {
	// Use apikey strategy
	passport.use(new APIKeyStrategy(
	  function(apikey, done) {
	    User.findOne({ apikey: apikey }, function (err, user) {
	      if (err) { return done(err); }
	      if (!user) { return done(null, false); }
	      return done(null, user);
	    });
	  }
	));
};