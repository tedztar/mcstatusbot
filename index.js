require('dotenv').config();
const { ClusterManager, ReClusterManager, fetchRecommendedShards } = require('discord-hybrid-sharding');
const express = require('express');
const { logSharding, logError } = require('./functions/consoleLogging');

let manager = new ClusterManager('./bot.js', { shardsPerClusters: 10, token: process.env.TOKEN });
manager.extend(new ReClusterManager());

manager.on('debug', logSharding);
try {
	spawnShards();
}
catch (error) {
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
			manager.recluster.start({ totalShards: recommendedShards, shardsPerClusters: 10, shardList: null, shardClusterList: null });
		}
	}
	catch (error) {
		logError('Error reclustering shards', error);
	}
}

express().listen(process.env.PORT || 5000);
