require('dotenv').config();
const { ClusterManager, ReClusterManager, fetchRecommendedShards } = require('discord-hybrid-sharding');
const express = require('express');
const { logSharding } = require('./functions/consoleLogging');

let manager = new ClusterManager('./bot.js', { shardsPerClusters: 10, token: process.env.TOKEN });
manager.extend(new ReClusterManager());

manager.on('debug', (message) => logSharding(message));
launchShards();

async function launchShards() {
	await manager.spawn();
	setTimeout(reclusterShards, 1 * 1 * 10 * 1000);
}

async function reclusterShards() {
	const recommendedShards = 2 // await fetchRecommendedShards(process.env.TOKEN);
	if (recommendedShards != manager.totalShards) {
		manager.recluster.start({ totalShards: recommendedShards, shardsPerClusters: 1, shardList: null, shardClusterList: null });
	}
}

express().listen(process.env.PORT || 5000);
