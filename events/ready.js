const deployCommands = require('../functions/deployCommands');
const updateChannels = require('../functions/updateChannels');
const ping = require('web-pingjs');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await deployCommands.execute();
		console.log('Ready!');
		client.user.setActivity('/help', { type: 'WATCHING' });
		updateServers(client);
		wakeDyno();
		setInterval(updateServers, 5 * 60 * 1000, client);
		setInterval(wakeDyno, 20 * 60 * 1000);
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

async function wakeDyno() {
	ping('https://mcstatus-discordbot.herokuapp.com/')
		.catch(err => {
			console.error('Could not ping remote URL', err);
		});
}