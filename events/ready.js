const deployCommands = require('../functions/deployCommands');
const updateChannels = require('../functions/updateChannels');
const ping = require('web-pingjs');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await deployCommands.execute();
		await client.user.setActivity('/help', { type: 'WATCHING' });
		console.log('Ready!');
		await updateServers(client);
		await wakeDyno();
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
		console.log('Servers updated.')
}

async function wakeDyno() {
	await ping('https://mcstatus-discordbot.herokuapp.com/')
		.then(() => {
			console.log('Pinged Heroku server.',)
		})
		.catch(err => {
			console.error('Could not ping Heroku server. ', err);
		});
}