require('dotenv').config();
const { ClusterManager } = require('discord-hybrid-sharding');
const express = require('express');
const { logSuccess } = require('./functions/consoleLogging');

const manager = new ClusterManager('./bot.js', { token: process.env.TOKEN });

manager.on('clusterCreate', (cluster) => logSuccess(`Shard ${cluster.id} CREATED`));
manager.spawn();

express().listen(process.env.PORT || 5000);
