const deployCommands = require('../functions/deployCommands');
const updateChannels = require('../functions/updateChannels');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await deployCommands.execute();
		await client.user.setActivity('/help', { type: 'WATCHING' });
		console.log('Ready!');
		await updateServers(client);
		setInterval(updateServers, 5 * 60 * 1000, client);
	}
};

async function updateServers(client) {
	let serversUpdated = 0;

	await client.guilds.cache.forEach(async (guild) => {
		let serverList = (await serverDB.get(guild.id)) || [];
		for (const server of serverList) {
			await updateChannels.execute(server);
			serversUpdated++;
		}
	});

	console.log(`${serversUpdated} servers updated.`);
}
