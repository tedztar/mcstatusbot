module.exports = {
	async execute(guild, server) {
		// Remove channels and server category
		try {
			const channels = [
				await guild.channels.cache.get(server.statusId),
				await guild.channels.cache.get(server.playersId),
				await guild.channels.cache.get(server.categoryId)
			];
			channels.forEach((channel) => channel.delete());
		} catch (error) {
			console.log(error);
		}

		// Remove server from database
		let monitoredServers = (await serverDB.get(guild.id)) || [];
		serverIndex = await monitoredServers.indexOf(server);
		await monitoredServers.splice(serverIndex, 1);
		await serverDB.set(guild.id, monitoredServers);
	}
};
