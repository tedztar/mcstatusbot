const { Events } = require('discord.js');
const { deployCommands } = require('../functions/deployCommands');
const { getServerStatus } = require('../functions/getServerStatus');
const { renameChannels } = require('../functions/renameChannels');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await deployCommands();
		await client.user.setActivity('/help', { type: 'WATCHING' });
		console.log('Ready!');
		await updateServers(client);
		setInterval(updateServers, 6 * 60 * 1000, client);
	}
};

// Fix await/async to speed up fucntion
async function updateServers(client) {
	await client.guilds.cache.forEach(async (guild) => {
		let serverList = (await serverDB.get(guild.id)) || [];
		for (const server of serverList) {
			let serverStatus;
			try {
				serverStatus = await getServerStatus(server.ip, 30*1000);
			}
			catch {
				console.warn(
					`Error pinging Minecraft server while updating servers
						Guild ID: ${guild.id}
						Server IP: ${server.ip}`
				)
			}
			const channels = [
				{ object: await client.channels.cache.get(server.statusId), name: 'statusName' },
				{ object: await client.channels.cache.get(server.playersId), name: 'playersName' }
			];
			await renameChannels(channels, serverStatus);
		}
	});
	console.log('Servers updated');
}
