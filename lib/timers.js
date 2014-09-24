/**
 * Collection of various utility functions.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module utils
 * @class Utils
 * @static
*/

"use strict";

var NAME = '[utils-timers]: ';
/**
 * Forces a function to be run asynchronously, but as fast as possible. In Node.js
 * this is achieved using `setImmediate` or `process.nextTick`.
 *
 * @method _asynchronizer
 * @param callbackFn {Function} The function to call asynchronously
 * @static
 * @private
**/
var _asynchronizer = (typeof setImmediate !== 'undefined') ?
                        function (fn) {setImmediate(fn);} :
                        ((typeof process !== 'undefined') && process.nextTick) ?
                            process.nextTick :
                            function (fn) {setTimeout(fn, 0);};


/**
 * Invokes the callbackFn once in the next turn of the JavaScript event loop. If the function
 * requires a specific execution context or arguments, wrap it with Function.bind.
 *
 * I.async returns an object with a cancel method.  If the cancel method is
 * called before the callback function, the callback function won't be called.
 *
 * @method async
 * @param {Function} callbackFn
 * @param [invokeAfterFn=true] {boolean} set to false to prevent the _afterSyncFn to be invoked
 * @return {Object} An object with a cancel method.  If the cancel method is
 * called before the callback function, the callback function won't be called.
**/
module.exports.async = function (callbackFn, invokeAfterFn) {
	console.log(NAME, 'async');
	var host = this,
		canceled;

	invokeAfterFn = (typeof invokeAfterFn === 'boolean') ? invokeAfterFn : true;
	(typeof callbackFn==='function') && _asynchronizer(function () {
		if (!canceled) {
        	console.log(NAME, 'async is running its callbakcFn');
			callbackFn();
			// in case host._afterAsyncFn is defined: invoke it, to identify that later has been executed
			invokeAfterFn && host._afterAsyncFn && host._afterAsyncFn();
		}
	});

	return {
		cancel: function () {
			canceled = true;
		}
	};
};

/**
 * Invokes the callbackFn after a timeout (asynchronous). If the function
 * requires a specific execution context or arguments, wrap it with Function.bind.
 *
 * To invoke the callback function periodic, set 'periodic' either 'true', or specify a second timeout.
 * If number, then periodic is considered 'true' but with a perdiod defined by 'periodic',
 * which means: the first timer executes after 'timeout' and next timers after 'period'.
 *
 * I.later returns an object with a cancel method.  If the cancel() method is
 * called before the callback function, the callback function won't be called.
 *
 * @method later
 * @param callbackFn {Function} the function to execute.
 * @param [timeout] {Number} the number of milliseconds to wait until the callbackFn is executed.
 * when not set, the callback function is invoked once in the next turn of the JavaScript event loop.
 * @param [periodic] {boolean|Number} if true, executes continuously at supplied, if number, then periodic is considered 'true' but with a perdiod
 * defined by 'periodic', which means: the first timer executes after 'timeout' and next timers after 'period'.
 * The interval executes until canceled.
 * @param [invokeAfterFn=true] {boolean} set to false to prevent the _afterSyncFn to be invoked
 * @return {object} a timer object. Call the cancel() method on this object to stop the timer.
*/
module.exports.later=  function (callbackFn, timeout, periodic, invokeAfterFn) {
	console.log(NAME, 'later --> timeout: '+timeout+'ms | periodic: '+periodic);
	var host = this,
		canceled = false;
	invokeAfterFn = (typeof invokeAfterFn === 'boolean') ? invokeAfterFn : true;
	if (!timeout) {
		return host.async(callbackFn);
	}
	var interval = periodic,
		secondtimeout = (typeof interval==='number'),
		secondairId,
		wrapper = function() {
			// IE 8- and also nodejs may execute a callback, so in order to preserve
			// the cancel() === no more runny-run, we have to build in an extra conditional
			if (!canceled) {
            	console.log(NAME, 'later is running its callbakcFn');
				callbackFn();
				secondtimeout && (secondairId=setInterval(wrapperInterval, interval));
				// in case host._afterAsyncFn is defined: invoke it, to identify that later has been executed
				invokeAfterFn && host._afterAsyncFn && host._afterAsyncFn();
			}
		},
		wrapperInterval = function() {
			// IE 8- and also nodejs may execute a setInterval callback one last time
			// after clearInterval was called, so in order to preserve
			// the cancel() === no more runny-run, we have to build in an extra conditional
			if (!canceled) {
            	console.log(NAME, 'later is running its callbakcFn');
				callbackFn();
				// in case host._afterAsyncFn is defined: invoke it, to identify that later has been executed
				invokeAfterFn && host._afterAsyncFn && host._afterAsyncFn();
			}
		},
		id;
	(typeof callbackFn==='function') && (id=(interval && !secondtimeout) ? setInterval(wrapperInterval, timeout) : setTimeout(wrapper, timeout));

	return {
		cancel: function() {
			canceled = true;
			interval ? clearInterval(id) : clearTimeout(id);
			secondairId && clearInterval(secondairId);
		}
	};
};
