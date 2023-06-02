const { Events } = require('discord.js');
const { logSuccess, logWarning } = require('../functions/consoleLogging');
const { getKey, setKey } = require('../functions/databaseFunctions');
const { getServerStatus } = require('../functions/getServerStatus');
const { renameChannels } = require('../functions/renameChannels');

const name = Events.ClientReady;
const once = true;

async function execute(client) {
	logSuccess(`Shard ${client.cluster.id} READY`);
	await updateServers(client);
	setInterval(updateServers, 6 * 60 * 1000, client);
}

async function updateServers(client) {
	// Update server count badge
	if (client.cluster.id == 0) {
		try {
			let serverCountByShard = await client.cluster.broadcastEval('this.guilds.cache.size');
			let serverCount = serverCountByShard.reduce((totalGuilds, shardGuilds) => totalGuilds + shardGuilds, 0);
			await setKey('serverCount', serverCount);
		}
		catch (error) {
			if (error.name != 'Error [ShardingInProcess]') logWarning('Error setting server count', error);
		}
	}

	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			let serverList = await getKey(guild.id);
			await Promise.allSettled(
				serverList.map(async (server) => {
					let serverStatus;
					try {
						serverStatus = await getServerStatus(server.ip, 30 * 1000);
					} catch (error) {
						logWarning('Error pinging Minecraft server while updating servers', {
							'Server IP': server.ip,
							'Guild ID': guild.id,
							Error: error
						});
					}
					const channels = [
						{ object: await guild.channels.cache.get(server.statusId), name: 'statusName' },
						{ object: await guild.channels.cache.get(server.playersId), name: 'playersName' }
					];
					await renameChannels(channels, serverStatus);
				})
			);
		})
	);
}

module.exports = { name, once, execute };
