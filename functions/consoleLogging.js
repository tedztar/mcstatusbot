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

function logSuccess(message) {
	logger.info(message);
}

function logWarning(message, error) {
	logger.warn({ details: error }, message);
}

function logError(message, error) {
	logger.fatal({ details: error }, message);
}

module.exports = { logSuccess, logWarning, logError };
