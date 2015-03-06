module.exports = {
	idGenerator: require('./lib/idgenerator.js').idGenerator,
    later: require('./lib/timers.js').later,
    async: require('./lib/timers.js').async
};