const deployCommands = require('../functions/deployCommands');
const updateChannels = require('../functions/updateChannels');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await deployCommands.execute();
		console.log('Ready!');
		client.user.setActivity('/help', { type: 'WATCHING' });
		updateServers(client);
		setInterval(updateServers, 6 * 60 * 1000, client);
	}
}

async function updateServers(client) {
	client.guilds.cache
		.forEach(async guild => {
			let serverList = await serverDB.get(guild.id) ? await serverDB.get(guild.id) : [];
			for (const server of serverList) {
				await updateChannels.execute(server);
			};
		});
}