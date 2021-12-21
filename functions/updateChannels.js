const mcping = require('mcping-js');

module.exports = {
    execute(server) {
        const mcserver = new mcping.MinecraftServer(server.ip.split(':')[0], Number(server.ip.split(':')[1]));
        const statusChannel = client.channels.cache.get(server.statusId);
        const playersChannel = client.channels.cache.get(server.playersId);
        mcserver.ping(2500, settings.protocolversion, async function (err, res) {
            if (!(typeof err === 'undefined' || err === null)) {
                statusChannel.setName('Status: Offline');
                playersChannel.permissionOverwrites.edit(chann.guild.roles.everyone, {
                    VIEW_CHANNEL: false
                });
            }
            else {
                statusChannel.setName('Status: Online');
                permissionOverwrites.edit(chann.guild.roles.everyone, {
                    VIEW_CHANNEL: true
                });
            }
            playersChannel.setName('Players: ' + res.players.online + ' / ' + res.players.max);
        })
    }
}