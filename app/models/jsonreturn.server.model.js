'use strict';

var _ = require('lodashim');

/**
 * Default object to be returned in every api requisition
 * o: Object returned
 * m: Message to user interface
 * s: Status of requisition
 */
var	JsonReturn = function(settings, status, object) {

	if (!(this instanceof JsonReturn))
		return new JsonReturn(settings);

	if (typeof settings === 'string')
		settings = { m: settings };

	if (typeof settings === 'number')
		settings = { s: settings };
	
	var jsonReturn = {
		o: object || {},
		m: '',
		s: status || 0 
	};

	_.extend(jsonReturn, settings);

	if (!jsonReturn.m && jsonReturn.s < 0)
		jsonReturn.m = 'Ocorreu um erro: ' + jsonReturn.s;
	else if (!jsonReturn.m && jsonReturn.s > 0)
		jsonReturn.m = 'Ação realizada com sucesso.';

	return jsonReturn;

};

module.exports = JsonReturn;