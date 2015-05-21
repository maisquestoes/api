'use strict';

var JsonReturn = require('../models/jsonreturn.server.model');

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	//req.i18n.setLng('pt-BR');
	res.jsonp(JsonReturn(req.i18n.t('We are hiring!')));
};