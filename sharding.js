require('dotenv').config();
const { ClusterManager, ReClusterManager, fetchRecommendedShards } = require('discord-hybrid-sharding');
const express = require('express');
const { logSuccess } = require('./functions/consoleLogging');

let manager = new ClusterManager('./bot.js', { shardsPerClusters: 10, token: process.env.TOKEN });
manager.extend(new ReClusterManager())

manager.on('debug', console.log)
manager.on('clusterCreate', (cluster) => logSuccess(`Cluster ${cluster.id} CREATED`));
launchShards();

async function launchShards() {
	await manager.spawn();
	setInterval(reclusterShards, 24 * 60 * 60 * 1000);
}

async function reclusterShards() {
	const recommendedShards = await fetchRecommendedShards(process.env.TOKEN);
	if (recommendedShards != manager.totalShards) {
		logSuccess(`Reclustering Shards`);
		manager.recluster.start({ totalShards: recommendedShards, shardsPerClusters: 10, shardList: null, shardClusterList: null });
	}
}

express().listen(process.env.PORT || 5000);
