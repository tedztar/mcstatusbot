const updateChannels = require('../functions/updateChannels')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		const pingInterval = 30;
		console.log('Ready!');
		client.user.setActivity('/help', { type: 'WATCHING' });
		updateServers.execute(client);
		setInterval(updateServers.execute, pingInterval * 1000, client);
	}
}

async function updateServers(client) {
	client.guilds.cache
		.forEach(guild => {
			mcServers.get(guild.id)
				.forEach(server => {
					updateChannels(server);
				});
		});
}