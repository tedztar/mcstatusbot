module.exports = {
	async execute(guild, server) {
        // Remove server from database
		let monitoredServers = (await serverDB.get(guild.id)) || [];
		serverIndex = await monitoredServers.indexOf(server);
		await monitoredServers.splice(serverIndex, 1);
		await serverDB.set(guild.id, monitoredServers);
        
		// Remove channels and server category
		const channels = [
			await guild.channels.cache.get(server.statusId),
			await guild.channels.cache.get(server.playersId),
			await guild.channels.cache.get(server.categoryId)
		];
        for (const channel of channels) {
            try {
                channel.delete();
            } catch(error) {
                console.warn(
                    `Error deleting channel while removing server from guild
                        Channel ID: ${channel.id}
                        Guild ID: ${guild.id}
                        Server IP: ${server.ip}`
                );
                throw error;
            }
        }
	}
};
