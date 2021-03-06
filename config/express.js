'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var ratelimit = require('ratelimit-middleware');
var morgan = require('morgan');
var compress = require('compression');
var methodOverride = require('method-override');
var helmet = require('helmet');
var passport = require('passport');
var config = require('./config');
var path = require('path');
var i18n = require('i18next');
var _ = require('lodash');
var JsonReturn = require('../app/models/jsonreturn.server.model');

module.exports = function() {
  // Initialize express app
  var app = express();

  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;
  app.locals.facebookAppId = config.facebook.clientID;

  if (process.env.NODE_ENV === 'production') {
    app.use(ratelimit({
      burst: 10,
      rate: 0.5,
      ip: true
    }));
  }
   // Passing the request url to environment locals
  app.use(function(req, res, next) {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
  });

  // Should be placed before express.static
  app.use(compress({
    filter: function(req, res) {
              return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
            },
    level: 9
  }));

  // Showing stack errors
  app.set('showStackError', true);

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    app.use(morgan('dev'));

  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  var configI18n = {
    resGetPath: 'locales/__lng__.json',
    resPostPath: 'locales/__lng__.json', 
    resSetPath: 'locales/__lng__.json', 
    preload: ['en', 'pt'],
    useCookie: false,
    fallbackLng: 'en',
  };

  if (process.env.NODE_ENV === 'development') {
    configI18n = _.extend(configI18n,{
      saveMissing: true,
      sendMissingTo: 'fallback',
      debug: true,
    });
  }

  i18n.init(configI18n);

  app.use(i18n.handle);

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  app.use(function(req, res, next) {

    res._jsonp = res.jsonp;

    res.jsonp = function () {
      var args = Array.prototype.slice.call(arguments);
      var ret = args.map(function(arg) {
        if (typeof(arg) === 'string') {
          return req.i18n.t(arg);
        } 
        return arg;
      });
      res._jsonp(JsonReturn.apply(null, ret));
    };
    next();
  });

  app.use(methodOverride());
  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // Use helmet to secure Express headers
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.disable('x-powered-by');

  // Globbing routing files
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
                                           require(path.resolve(routePath))(app);
                                           });

    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function(err, req, res, next) {
    // If the error object doesn't exists
    if (!err) { return next(); }

    // Log it
    console.error(err.stack);
    console.log(err);

    // Error page
    res.status(500).jsonp(err.message, -500);
    });

    // Assume 404 since no middleware responded
    app.use(function(req, res) {
    res.status(404).jsonp('File Not Found', -404);
    });

    if (process.env.NODE_ENV === 'secure') {
    // Log SSL usage
    console.log('Securely using https protocol');

    // Load SSL key and certificate
    var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
    var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

    // Create HTTPS Server
    var httpsServer = https.createServer({
    key: privateKey,
    cert: certificate
    }, app);

    // Return HTTPS server instance
    return httpsServer;
    }

    // Return Express server instance
    return app;
    };
