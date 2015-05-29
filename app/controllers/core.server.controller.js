'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	//req.i18n.setLng('pt-BR');
	//res.mq(req.i18n.t('We are hiring'));
	//res.jsonp(JsonReturn(req.i18n.t('We are hiring')));
	res.jsonp('We are hiring');
};