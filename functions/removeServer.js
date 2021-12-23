module.exports = {
    async execute(guild, server) {
        // Remove channels and server category
        statusChannel = await guild.channels.cache.get(server.statusId);
        playersChannel = await guild.channels.cache.get(server.playersId);
        serverCategory = await guild.channels.cache.get(server.categoryId);
        statusChannel ? await statusChannel.delete() : null;
        playersChannel ? await playersChannel.delete() : null;
        serverCategory ? await serverCategory.delete() : null;

        // Remove server from database
        let monitoredServers = await serverDB.get(guild.id) ? await serverDB.get(guild.id) : [];
        serverIndex = monitoredServers.indexOf(server);
        monitoredServers.splice(serverIndex, 1);
        await serverDB.set(guild.id, monitoredServers);
    }
}