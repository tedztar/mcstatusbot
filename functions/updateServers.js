const { logWarning } = require('../functions/consoleLogging');
const { getKey, setKey } = require('../functions/databaseFunctions');
const { getServerStatus } = require('../functions/getServerStatus');
const { renameChannels } = require('../functions/renameChannels');

async function updateServers(client) {
	// Update server count badge
	if (client.cluster.id == 0) {
		try {
			let serverCountByShard = await client.cluster.broadcastEval('this.guilds.cache.size');
			let serverCount = serverCountByShard.reduce((totalGuilds, shardGuilds) => totalGuilds + shardGuilds, 0);
			await setKey('serverCount', serverCount);
		} catch (error) {
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
						if (process.env.DETAILED_LOGS == 'TRUE') {
							logWarning('Error pinging Minecraft server while updating servers', {
								'Server IP': server.ip,
								'Guild ID': guild.id,
								Error: serverStatus.error || error
							});
						}
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

module.exports = { updateServers };
