'use strict';
import { ClusterManager, ReClusterManager, fetchRecommendedShards } from 'discord-hybrid-sharding';
import 'dotenv/config';
import { logError, logSharding } from './functions/consoleLogging.js';
import { deployCommands } from './functions/deployCommands.js';

const shardsPerClusters = 2;

deployCommands();

let manager = new ClusterManager('./bot.js', {
	shardsPerClusters: shardsPerClusters,
	token: process.env.TOKEN,
	mode: 'process'
});
manager.extend(new ReClusterManager());
manager.on('debug', logSharding);

try {
	spawnShards();
} catch (error) {
	logError('Error spawning shards', error);
}

async function spawnShards() {
	await manager.spawn();
	setInterval(reclusterShards, 24 * 60 * 60 * 1000);
}

async function reclusterShards() {
	try {
		const recommendedShards = await fetchRecommendedShards(process.env.TOKEN);
		if (recommendedShards != manager.totalShards) {
			manager.recluster.start({
				restartMode: 'gracefulSwitch',
				totalShards: recommendedShards,
				shardsPerClusters: shardsPerClusters,
				shardList: null,
				shardClusterList: null
			});
		}
	} catch (error) {
		logError('Error reclustering shards', error);
	}
}
