const { Events } = require('discord.js');
const { getKey, setKey } = require('../functions/databaseFunctions');
const { deployCommands } = require('../functions/deployCommands');
const { getServerStatus } = require('../functions/getServerStatus');
const { renameChannels } = require('../functions/renameChannels');

const name = Events.ClientReady;
const once = true;

async function execute(client) {
	await deployCommands();
	await client.user.setActivity('/help', { type: 'WATCHING' });
	console.log('Ready!');
	await updateServers(client);
	setInterval(updateServers, 6 * 60 * 1000, client);
}

// Fix await/async to speed up fucntion
async function updateServers(client) {
	let serverCount = client.guilds.cache.size;
	await setKey('applicationData', 'serverCount', serverCount);
	
	await client.guilds.cache.forEach(async (guild) => {
		let serverList = await getKey('guildData', guild.id);
		for (const server of serverList) {
			let serverStatus;
			try {
				serverStatus = await getServerStatus(server.ip, 30 * 1000);
			}
			catch {
				console.warn(
					`Error pinging Minecraft server while updating servers
						Guild ID: ${guild.id}
						Server IP: ${server.ip}`
				)
			}
			const channels = [
				{ object: await guild.channels.cache.get(server.statusId), name: 'statusName' },
				{ object: await guild.channels.cache.get(server.playersId), name: 'playersName' }
			];
			await renameChannels(channels, serverStatus);
		}
	});
	console.log('Servers updated');
}

module.exports = { name, once, execute };
