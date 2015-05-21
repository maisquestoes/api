'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var helmet = require('helmet');
var passport = require('passport');
var config = require('./config');
var consolidate = require('consolidate');
var path = require('path');
var i18n = require('i18next');
var JsonReturn = require('../app/models/jsonreturn.server.model');

module.exports = function(db) {
	// Initialize express app
	var app = express();

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;
	app.locals.facebookAppId = config.facebook.clientID;

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

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	i18n.init({
		resGetPath: 'locales/__lng__.json', 
		preload: ['en-US', 'pt-BR'],
		saveMissing: true,
		sendMissingTo: 'fallback',
		debug: true,
	});

	app.use(i18n.handle);

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
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).jsonp(JsonReturn({ m: err.stack, s: -500 }));
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).jsonp(JsonReturn({ m: '404 - File Not Found', s: -404 }));
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