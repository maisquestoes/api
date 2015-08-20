'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('../errors.server.controller');
var mongoose = require('mongoose');
var UserSchema = require('../../models/user.server.model');
var User = mongoose.model('User', UserSchema);
var config = require('../../../config/config');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var email = require('../../models/email.server.model');

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res) {
  if (req.body.email) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (!user) {
        return res.status(400).jsonp('No account with that email has been found.', -401);
      }
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          if (err) {
            return res.status(500).jsonp(err.message,-500);
          }
          email.forgotPassword(user.resetPasswordToken, user.email, user.name);
          return res.status(200).jsonp('Please check your email to recover your password');
        });
      });
    });
  } else {
    return res.status(400).jsonp('Email field must not be blank', -401);
  }
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (!user) {
      return res.redirect('/#!/password/reset/invalid');
    }

    res.redirect('/#!/password/reset/' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  async.waterfall([

    function(done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function(err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function(err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    // Return authenticated user 
                    res.json(user);

                    done(err, user);
                  }
                });
              }
            });
          } else {
            return res.status(400).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    function(user, done) {
      res.render('templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function(err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      var smtpTransport = nodemailer.createTransport(config.mailer.options);
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) { return next(err); }
  });
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
  // Init Variables
  var passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function(err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function(err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function(err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(400).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(400).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
