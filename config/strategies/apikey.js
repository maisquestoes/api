'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalAPIKeyStrategy = require('passport-localapikey').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	// Use apikey strategy
	passport.use(new LocalAPIKeyStrategy(
	  function(apikey, done) {
	    User.findOne({ apikey: apikey }, function (err, user) {
	      if (err) { return done(err); }
	      if (!user) { return done(null, false); }
	      return done(null, user);
	    });
	  }
	));
};