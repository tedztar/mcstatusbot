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
	console.log('Ready!');
	await updateServers(client);
	setInterval(updateServers, 6 * 60 * 1000, client);
}

// Fix await/async to speed up fucntion
async function updateServers(client) {
	let serverCount = client.shard.fetchClientValues('guilds.cache.size').then((results) => results.reduce((acc, guildCount) => acc + guildCount, 0));
	await setKey('serverCount', serverCount);

	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			let serverList = await getKey(guild.id);
			await Promise.allSettled(
				serverList.map(async (server) => {
					let serverStatus;
					try {
						serverStatus = await getServerStatus(server.ip, 30 * 1000);
					} catch (error) {
						logWarning(
							`Error pinging Minecraft server while updating servers
						Guild ID: ${guild.id}
						Server IP: ${server.ip}`,
							error
						);
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
	logSuccess('Servers updated');
}

module.exports = { name, once, execute };
