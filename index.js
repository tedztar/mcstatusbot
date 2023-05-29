require("dotenv").config();
const { ShardingManager } = require("discord.js");
const express = require("express");

const manager = new ShardingManager("./bot.js", { token: process.env.TOKEN });

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));
manager.spawn();

express().listen(process.env.PORT || 5000);
