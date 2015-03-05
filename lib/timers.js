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


(function (global) {

	"use strict";

	require('polyfill/polyfill-base.js');

	var NAME = '[utils-timers]: ',
	    _asynchronizer, _async, _asynchronizerSilent, _later;

    // make _setTimeout and _setInterval available, so the code always works
    // both methods may be overruled by itags
    global._setTimeout = global.setTimeout;
    global._setInterval = global.setInterval;

	/**
	 * Forces a function to be run asynchronously, but as fast as possible. In Node.js
	 * this is achieved using `setImmediate` or `process.nextTick`.
	 *
	 * @method _asynchronizer
	 * @param callbackFn {Function} The function to call asynchronously
	 * @static
	 * @private
	**/
	_asynchronizer = (typeof global.setImmediate !== 'undefined') ?
						function (fn) {
							global.setImmediate(fn);
						} :
                	((typeof global.process !== 'undefined') && global.process.nextTick) ?
                		global.process.nextTick :
                		function (fn) {
                    		global.setTimeout(fn, 0);
                    	};

	/**
	 * Forces a function to be run asynchronously, but as fast as possible. In Node.js
	 * this is achieved using `setImmediate` or `process.nextTick`.
	 *
	 * @method _asynchronizerSilent
	 * @param callbackFn {Function} The function to call asynchronously
	 * @static
	 * @private
	**/
	_asynchronizerSilent = (typeof global.setImmediate !== 'undefined') ?
								function (fn) {
									global._setImmediate(fn);
								} :
		                		function (fn) {
		                    		global._setTimeout(fn, 0);
		                    	};

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
	_async = function (callbackFn, invokeAfterFn) {
		console.log(NAME, 'async');
		invokeAfterFn = (typeof invokeAfterFn === 'boolean') ? invokeAfterFn : true;
		var canceled, callback,
			// if not available, then don't invoke the afterFn:
		    originalTimer = (invokeAfterFn || !global._setTimeout);

		if (typeof callbackFn==='function') {
			callback = function () {
				if (!canceled) {
					callbackFn();
				}
			};
			originalTimer ? _asynchronizer(callback) : _asynchronizerSilent(callback);
		}

		return {
			cancel: function () {
				canceled = true;
			}
		};
	};

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
	module.exports.async = _async;
	module.exports.async = function() {
		return _async.call(this, arguments[0], false);
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
	_later = function (callbackFn, timeout, periodic, invokeAfterFn) {
		console.log(NAME, 'later --> timeout: '+timeout+'ms | periodic: '+periodic);
		// if not available, then don't invoke the afterFn:
		invokeAfterFn = (typeof invokeAfterFn === 'boolean') ? invokeAfterFn : true;
		if (!timeout) {
			return _async(callbackFn, invokeAfterFn);
		}
		var interval = periodic,
			secondtimeout = (typeof interval==='number'),
		    canceled = false,
		    originalTimer = (invokeAfterFn || !global._setTimeout),
			secondairId,
			wrapper = function() {
				// IE 8- and also nodejs may execute a callback, so in order to preserve
				// the cancel() === no more runny-run, we have to build in an extra conditional
				if (!canceled) {
					callbackFn();
					if (secondtimeout) {
						secondairId = originalTimer ? global.setInterval(wrapperInterval, interval) : global._setInterval(wrapperInterval, interval);
					}
					// break closure inside returned object:
					id = null;
				}
			},
			wrapperInterval = function() {
				// IE 8- and also nodejs may execute a setInterval callback one last time
				// after clearInterval was called, so in order to preserve
				// the cancel() === no more runny-run, we have to build in an extra conditional
				if (!canceled) {
					callbackFn();
				}
			},
			id;
		if (typeof callbackFn==='function') {
/*jshint boss:true */
			if (id=(interval && !secondtimeout)) {
/*jshint boss:false */
				originalTimer ? global.setInterval(wrapperInterval, timeout) : global._setInterval(wrapperInterval, timeout);
			}
			else {
				originalTimer ? global.setTimeout(wrapper, timeout) : global._setTimeout(wrapper, timeout);
			}
		}

		return {
			cancel: function() {
				canceled = true;
				(interval && !secondtimeout) ? clearInterval(id) : clearTimeout(id);
				secondairId && clearInterval(secondairId);
				// break closure:
				id = null;
				secondairId = null;
			}
		};
	};

	module.exports.later = _later;

	module.exports.later = function() {
		var args = arguments,
			newArgs = [];
		newArgs[0] = args[0];
		newArgs[1] = args[1];
		newArgs[2] = args[2];
		newArgs[3] = false;
		return _later.apply(this, newArgs);
	};


}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));
