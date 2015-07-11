'use strict';

/**
 * Default object to be returned in every api requisition
 * o: Object returned
 * m: Message to user interface
 * s: Status of requisition
 */
var	JsonReturn = function() {

	var jsonReturn = {
		o: {},
		m: '',
		s: 0 
	};

	var args = Array.prototype.slice.call(arguments);

	args.map(function(arg) {
		if (typeof(arg) === 'string') {
			return jsonReturn.m = arg;
		} else if (typeof(arg) === 'number') {
			return jsonReturn.s = arg;
		}
		return jsonReturn.o = arg;
	});

	if (!jsonReturn.m && jsonReturn.s < 0) {
		jsonReturn.m = 'Ocorreu um erro: ' + jsonReturn.s;
	} else if (!jsonReturn.m && jsonReturn.s > 0) {
		jsonReturn.m = 'Ação realizada com sucesso.';
	}

	return jsonReturn;

};

module.exports = JsonReturn;