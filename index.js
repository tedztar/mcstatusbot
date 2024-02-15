'use strict';
import { ClusterManager, ReClusterManager, fetchRecommendedShards } from 'discord-hybrid-sharding';
import 'dotenv/config';
import { beaver } from './functions/consoleLogging.js';

const shardsPerClusters = 5;

let manager = new ClusterManager('./bot.js', {
	shardsPerClusters: shardsPerClusters,
	token: process.env.TOKEN,
	mode: 'process'
});
manager.extend(new ReClusterManager());
manager.on('debug', (msg) => beaver.log('sharding', msg));

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
		beaver.log('sharding', error);
	}
}

try {
	spawnShards();
} catch (error) {
	beaver.log('sharding', error);
}
