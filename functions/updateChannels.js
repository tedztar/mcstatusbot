const mcping = require('mcping-js');

module.exports = {
	async execute(server) {
		const [ip, port] = server.ip.split(':');

		const mcserver = new mcping.MinecraftServer(ip, parseInt(port) || 25565);
		const statusChannel = await client.channels.cache.get(server.statusId);
		const playersChannel = await client.channels.cache.get(server.playersId);

		try {
			mcserver.ping(2500, 47, async (err, res) => {
				err ? await setOffline(statusChannel, playersChannel) : await setOnline(statusChannel, playersChannel, res);
			});
		} catch (error) {
			console.log(`${error.code}: encountered while updating server ${ip}:${port}`);
		}
	}
};

async function setOffline(statusChannel, playersChannel) {
	try {
		if (statusChannel) await statusChannel.setName('Status: Offline');
		if (playersChannel) {
			await playersChannel.permissionOverwrites.edit(playersChannel.guild.roles.everyone, {
				ViewChannel: false
			});
			await playersChannel.setName('Players: 0');
		}
	} catch (error) {
		console.log(`${error.code}: encountered while setting ${statusChannel}, ${playersChannel} as offline`);
	}
}

async function setOnline(statusChannel, playersChannel, res) {
	try {
		if (statusChannel) await statusChannel.setName('Status: Online');
		if (playersChannel) {
			await playersChannel.permissionOverwrites.edit(playersChannel.guild.roles.everyone, {
				ViewChannel: true
			});
			await playersChannel.setName(`Players: ${res.players?.online ?? 0} / ${res.players?.max ?? 'undefined'}`);
		}
	} catch (error) {
		console.log(`${error.code}: encountered while setting ${statusChannel}, ${playersChannel} as online`);
	}
}
