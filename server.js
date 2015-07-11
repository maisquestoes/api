'use strict';
require('./config/init')();

var config = require('./config/config');
var mongoose = require('mongoose');
var chalk = require('chalk');

var db = mongoose.connect(config.db, function(err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  }
});

var app = require('./config/express')(db);

require('./config/passport')();

app.listen(config.port);

console.log(chalk.green('+Questões started on port ' + config.port));

module.exports = app;
