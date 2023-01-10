const mcping = require('mcping-js');

module.exports = {
	async execute(server) {
		const mcserver = new mcping.MinecraftServer(server.ip.split(':')[0], Number(server.ip.split(':')[1]));
		const statusChannel = await client.channels.cache.get(server.statusId);
		const playersChannel = await client.channels.cache.get(server.playersId);

		mcserver.ping(2500, 47, async (err, res) => {
			try {
				err ? await setOffline(statusChannel, playersChannel) : await setOnline(statusChannel, playersChannel, res);
			} catch (e) {
				console.log(e);
			}
		});
	}
};

async function setOffline(statusChannel, playersChannel) {
	if (statusChannel) await statusChannel.setName('Status: Offline');
	if (playersChannel) {
		await playersChannel.permissionOverwrites.edit(playersChannel.guild.roles.everyone, {
			ViewChannel: false
		});
		await playersChannel.setName('Players: 0');
	}
}

async function setOnline(statusChannel, playersChannel, res) {
	if (statusChannel) await statusChannel.setName('Status: Online');
	if (playersChannel) {
		await playersChannel.permissionOverwrites.edit(playersChannel.guild.roles.everyone, {
			ViewChannel: true
		});
		await playersChannel.setName(`Players: ${res.players.online || 0} / ${res.players.max}`);
	}
}
