module.exports = {
    name: 'guildDelete',
    once: false,
    async execute(guild) {
        let monitoredServers = await serverDB.get(guild.id) ? await serverDB.get(guild.id) : [];
        for (const server of monitoredServers) {
            await removeServer.execute(guild, server);
        }
        serverDB.delete(guild.id);
    }
}