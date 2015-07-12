'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('../errors.server.controller');
var mongoose = require('mongoose');
var passport = require('passport');
var UserSchema = require('../../models/user.server.model');
var User = mongoose.model('User', UserSchema);
var _ = require('lodash');

exports.signup = function(req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  // Then save the user 
  user.save(function(err) {

    if (err) {
      console.error(err);
      return res.status(400).jsonp(errorHandler.getErrorMessage(err), -400);
    }

    req.login(user, function(err) {

      if (err) {
        console.error(err);
        return res.status(401).jsonp(err, -401);
      }

      //TODO: send an email from here

      var o = {
        email: user.email
      };

      if (process.env.NODE_ENV !== 'production') {
        o.verificationToken = user.verificationToken;
      }

      res.jsonp('Check your email to complete the signup.', o);

    });
  });

};

exports.signupFacebook = function(req, res) {
  delete req.body.roles;

  var user = User.find({facebookUid: req.body.facebookUid});

  if (user) {
    var info = {
      firstName: user.firstName,
      apikey: user.apikey,
      email: user.email,
      roles: user.roles
    };
    res.jsonp(info);
  } 

};

exports.signin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(401).jsonp(info.message, -401);
    } else {
      req.login(user, function(err) {
        if (err) {
          res.status(401).jsonp(err, -401);
        } else {
          var info = {
            firstName: user.firstName,
            apikey: user.apikey,
            email: user.email,
            roles: user.roles
          };
          res.jsonp(info);
        }
      });
    }
  })(req, res, next);
};

exports.signout = function(req, res) {
  var user = req.user;
  if (!user) {
    res.status(403).jsonp('User is not authenticated');
  }
  user.apikey = _.difference(user.apikey, [req.headers.apikey]);
  user.save(function(err) {
    if (err) {
      res.status(500).jsonp(-500);
    }
    res.jsonp('Successful signed out');
  });
};

exports.oauthCallback = function(strategy) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, redirectURL) {
      if (err || !user) {
        return res.redirect('/#!/signin');
      }
      req.login(user, function(err) {
        if (err) {
          return res.redirect('/#!/signin');
        }

        return res.redirect(redirectURL || '/');
      });
    })(req, res, next);
  };
};

exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function(err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
                 lastName: providerUserProfile.lastName,
                 username: availableUsername,
                 displayName: providerUserProfile.displayName,
                 email: providerUserProfile.email,
                 provider: providerUserProfile.provider,
                 providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function(err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) { user.additionalProvidersData = {}; }
      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function(err) {
        return done(err, user, '/#!/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res) {
  var user = req.user;
  var provider = req.param('provider');

  if (user && provider) {
    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
      delete user.additionalProvidersData[provider];

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
    }

    user.save(function(err) {
      if (err) {
        return res.status(400).jsonp({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).jsonp(err);
          } else {
            res.jsonp(user);
          }
        });
      }
    });
  }
};
