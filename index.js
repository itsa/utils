module.exports = {
	idGenerator: require('./lib/idgenerator.js').idGenerator,
	typeOf: require('./lib/typeof.js').typeOf,
	later: require('./lib/timers.js').later,
	async: require('./lib/timers.js').async
};
