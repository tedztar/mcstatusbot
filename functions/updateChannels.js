const mcping = require('mcping-js');

module.exports = {
    async execute(server) {
        const mcserver = new mcping.MinecraftServer(server.ip.split(':')[0], Number(server.ip.split(':')[1]));
        const statusChannel = await client.channels.cache.get(server.statusId);
        const playersChannel = await client.channels.cache.get(server.playersId);
        mcserver.ping(2500, 47, async function (err, res) {
            if (!(typeof err === 'undefined' || err === null)) {
                statusChannel ? await statusChannel.setName('Status: Offline') : null;
                playersChannel ? await playersChannel.permissionOverwrites.edit(playersChannel.guild.roles.everyone, {
                    VIEW_CHANNEL: false
                }) : null;
                playersChannel ? await playersChannel.setName('Players: 0') : null;
            }
            else {
                statusChannel ? await statusChannel.setName('Status: Online') : null;
                playersChannel ? await playersChannel.permissionOverwrites.edit(playersChannel.guild.roles.everyone, {
                    VIEW_CHANNEL: true
                }) : null;
                playersChannel ? await playersChannel.setName(`Players: ${res.players.online} / ${res.players.max}`) : null;
            }

        })
    }
}