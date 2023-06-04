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

function formatError(error) {
	if (process.env.DETAILED_LOGS == 'FALSE') {
		delete error['Error'];
	}
	return error;
}

function logSuccess(message) {
	logger.info(message);
}

function logWarning(message, error) {
	logger.warn({ details: formatError(error) }, message);
}

function logError(message, error) {
	logger.fatal({ details: formatError(error) }, message);
}

function logSharding(message) {
	let formattedMessage;

	// Messages from manager.recluster.start()
	if (message.includes('ReClustering')) {
		if (message.includes('Starting... Zerodowntime Reclustering')) {
			formattedMessage = message
				.substring(72)
				.split('\n', 3)
				.map((string) => ' '.repeat(33) + string.substring(4))
			formattedMessage.shift()
			formattedMessage = '[Starting Reclustering]\n' + formattedMessage.join('\n')
		}
		else if (message.includes('Switched OldCluster to NewCluster and exited Maintenance Mode')) {
			formattedMessage = 'Cluster ' + message
			.substring(34)
			.split(']')[0] + ' SWITCHED'
		}
		else if (message.includes('Finished ReClustering')) {
			formattedMessage = '[Finished Reclustering]'
		}
		else return;
	}

	// Messages from manager.spawn()
	else {
		if (message.includes('[Spawning Clusters]')) {
			formattedMessage = '[Spawning Clusters]\n' + message
				.substring(36)
				.replace('ClusterCount', 'Total Clusters')
				.replace('ShardCount', 'Total Shards')
				.split('\n', 2)
				.map((string) => ' '.repeat(33) + string.trim())
				.join('\n');
		}
		else if (message.includes('[CREATE]')) {
			formattedMessage = message.substring(33) + ' SPAWNED';
		}
		else if (message.includes('Ready')) {
			formattedMessage = message
				.substring(7)
				.split(']')[0] + ' READY'
		}
		else return;
	}

	logSuccess(formattedMessage)
}

module.exports = { logSuccess, logWarning, logError, logSharding };
