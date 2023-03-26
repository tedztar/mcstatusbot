const chalk = require('chalk');

function logSuccess(message) {
    process.env.LOG_SUCCESSES == 'TRUE' ? console.log(message) : null;
    return;
}

function logWarning(message, error) {
    console.log(chalk.yellow(message));
    process.env.LOG_ERRORS == 'TRUE' ? console.log(chalk.yellow(error)) : null;
    return;
}

function logError(message, error) {
    console.error(chalk.red(message, error))
    return;
}

module.exports = { logSuccess, logWarning, logError };