'use strict';
/**
 * Module dependencies.
 */
require('./config/init')();

var config = require('./config/config');
var mongoose = require('mongoose');
var chalk = require('chalk');



// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log(chalk.green('+Questões started on port ' + config.port));


