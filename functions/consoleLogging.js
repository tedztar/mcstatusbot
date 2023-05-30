const pino = require('pino');

const logger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			translateTime: 'SYS:dd-mm-yyyy, HH:MM:ss',
			ignore: 'pid,hostname'
		}
	}
});

function pruneError(error) {
	if (process.env.DETAILED_LOGS == 'FALSE') {
		delete error['Error'];
		return error;
	}

	return error;
}

function logSuccess(message) {
	logger.info(message);
}

function logWarning(message, error) {
	logger.warn({ details: pruneError(error) }, message);
}

function logError(message, error) {
	logger.fatal({ details: pruneError(error) }, message);
}

module.exports = { logSuccess, logWarning, logError };
