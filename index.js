require('dotenv').config();
const { ShardingManager } = require('discord.js');
const express = require('express');
const { logSuccess } = require('./functions/consoleLogging');

const manager = new ShardingManager('./bot.js', { token: process.env.TOKEN, respawn: true });

manager.on('shardCreate', (shard) => logSuccess(`Launched shard ${shard.id}`));
manager.spawn();

express().listen(process.env.PORT || 5000);
