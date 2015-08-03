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
var email = require('../../models/email.server.model');
var https = require('https');

exports.signup = function(req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  delete req.body.verificationToken;
  delete req.body.apikey;

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

      if (process.env.NODE_ENV === 'production') {
        email.sendConfirmation(user.verificationToken, user.email);
      }

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

exports.verification = function(req, res) {
  User.findOne({verificationToken: req.query.verificationToken}, function(err, user) {
    if (user) {
      if (err) {
        res.status(400).jsonp(-400);
      }
      user.status = 'active';
      user.verificationToken = undefined;
      user.save(function(err) {
        if (err) {
          res.status(400).jsonp(-400);
        }
        res.jsonp('User successful veryfied');
      });
    }
  });
};

exports.signinFacebook = function(req, res) {

  var options = {
    host: 'graph.facebook.com',
    path: '/v2.4/me?fields=id,name,email&access_token=' + req.body.access_token
  };

  var callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var fbUser = JSON.parse(str);
      if (fbUser.error) {
        res.status(400).jsonp(fbUser.error.message, 400);
      } else {
        User.findOne({ email: fbUser.email }, function(err, user) {
          var apikey = _.apikey();
          console.log(err);
          if (!user) {
            user = new User({
              name: fbUser.name,
              username: fbUser.email,
              email: fbUser.email,
              facebookUid: fbUser.id,
              password: _.apikey(),
              apikey: [apikey]
            });
          } else {
            user.facebookUid = fbUser.id;
            user.apikey.push(apikey);
          }
          user.save(function (err) {
            if (err) {
              res.status(500).jsonp(err.message);
            } else {
              var info = {
                name: user.name,
                apikey: apikey,
                email: user.email,
                roles: user.roles
              };
              res.jsonp(info);
            }
          });
        });
      }
    });
  };

  https.request(options, callback).end();

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
          var apikey = _.apikey();

          user.apikey.push(apikey);

          user.save(function(err) {
            if (err) {
              console.log(err);
            }
          });

          var info = {
            name: user.name,
            apikey: apikey,
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

