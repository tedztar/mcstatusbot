const mcping = require('mcping-js');
const unidecode = require('unidecode');

module.exports = {
	async execute(server) {
		let [ip, port] = server.ip.split(':');
		ip = unidecode(ip);
		port = parseInt(port || 25565);

		const mcserver = new mcping.MinecraftServer(ip, port);
		const statusChannel = await client.channels.cache.get(server.statusId);
		const playersChannel = await client.channels.cache.get(server.playersId);

		try {
			mcserver.ping(30000, 47, async (err, res) => {
				err ? await setOffline(statusChannel, playersChannel) : await setOnline(statusChannel, playersChannel, res);
			});
		} catch (error) {
			console.log(error);
			console.log(`Error: could not ping server ${ip}:${port}`);
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
		console.log(error);
		console.log(`Error: possibly reached rate limit while setting ${statusChannel}, ${playersChannel} as offline`);
	}
}

// ****Check channel name variables
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
		console.log(error);
		console.log(`Error: possibly reached rate limit while setting ${statusChannel}, ${playersChannel} as online`);
	}
}
