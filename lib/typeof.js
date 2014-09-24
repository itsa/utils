"use strict";
var TYPES = {
	'undefined'        : 'undefined',
	'number'           : 'number',
	'boolean'          : 'boolean',
	'string'           : 'string',
	'[object Function]': 'function',
	'[object RegExp]'  : 'regexp',
	'[object Array]'   : 'array',
	'[object Date]'    : 'date',
	'[object Error]'   : 'error'
};

/**
 * Collection of various utility functions.
 *
 * @module utils
 * @class Utils
 * @static
*/

/**
 * Improved version of the `typeof` operator, distinguishes Arrays, Date and nulls from Object.
 *
 * Returns one of the following strings, representing the type of the item passed in:
 *
 * "array"
 * "boolean"
 * "date"
 * "error"
 * "function"
 * "null"
 * "number"
 * "object"
 * "regexp"
 * "string"
 * "undefined"
 *
 * @method typeOf
 * @param o {Any} the item to test.
 * @return {string} the detected type.
 * @static
**/
module.exports.typeOf = function(o) {
	return TYPES[typeof o] || TYPES[({}.toString).call(o)] || (o ? 'object' : 'null');
};
