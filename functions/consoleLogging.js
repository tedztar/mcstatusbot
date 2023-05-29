const chalk = require('chalk');

function logSuccess(message) {
	if (process.env.LOG_SUCCESSES == 'TRUE') console.log(message + '\n');
}

function logWarning(message, error) {
	console.log(chalk.yellow(message));
	if (process.env.LOG_ERRORS == 'TRUE') console.log(chalk.yellow(error + '\n'));
}

function logError(message, error) {
	console.error(chalk.red(message, error));
}

module.exports = { logSuccess, logWarning, logError };
