const { Events } = require('discord.js');
const { logSuccess, logWarning } = require('../functions/consoleLogging');
const { getKey, setKey } = require('../functions/databaseFunctions');
const { deployCommands } = require('../functions/deployCommands');
const { getServerStatus } = require('../functions/getServerStatus');
const { renameChannels } = require('../functions/renameChannels');

const name = Events.ClientReady;
const once = true;

async function execute(client) {
	await deployCommands();
	logSuccess('Ready');
	await updateServers(client);
}

// Fix await/async to speed up fucntion
async function updateServers(client) {
	try {
		let shardCount = await client.shard.fetchClientValues('guilds.cache.size');
		let serverCount = shardCount.reduce((acc, guildCount) => acc + guildCount, 0);

		await setKey('serverCount', serverCount);
	} catch (error) {
		logWarning('Error setting server count', error);
	}

	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			let serverList = await getKey(guild.id);

			await Promise.allSettled(
				serverList.map(async (server) => {
					let serverStatus;

					try {
						serverStatus = await getServerStatus(server.ip, 10 * 1000);
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

	// Much better way of doing than setInterval
	setTimeout(updateServers, 5 * 60 * 1000, client);
}

module.exports = { name, once, execute };
