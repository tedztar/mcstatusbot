const { Events } = require('discord.js');
const deployCommands = require('../functions/deployCommands');
const renameChannels = require('../functions/renameChannels');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await deployCommands.execute();
		await client.user.setActivity('/help', { type: 'WATCHING' });
		console.log('Ready!');
		await updateServers(client);
		setInterval(updateServers, 6 * 60 * 1000, client);
	}
};

async function updateServers(client) {
	await client.guilds.cache.forEach(async (guild) => {
		let serverList = (await serverDB.get(guild.id)) || [];
		for (const server of serverList) {
			await renameChannels.execute(server, client);
		}
	});

	console.log('Servers updated');
}
