const mcping = require('mcping-js');
const unidecode = require('unidecode');

module.exports = {
    async execute(server, client) {
        let [ip, port] = server.ip.split(':');
        ip = unidecode(ip);
        port = parseInt(port || 25565);

        const mcserver = new mcping.MinecraftServer(ip, port);
        const statusChannel = await client.channels.cache.get(server.statusId);
        const playersChannel = await client.channels.cache.get(server.playersId);

        try {
            mcserver.ping(30000, 47, async (err, res) => {
                let isOnline = !err ? true : false;
                let statusName = isOnline ? 'Status: Online' : 'Status: Offline';
                let playersName = isOnline ? `Players: ${res.players?.online ?? '?'} / ${res.players?.max ?? '?'}` : 'Players: 0';
                await setStatus(statusChannel, playersChannel, statusName, playersName, isOnline, client);
            });
        } catch (error) {
            console.warn(
                `Error pinging Minecraft server while updating server status
                    Guild ID: ${statusChannel.guildId}
                    Server IP: ${server.ip}`
            )
        }
    }
};

async function setStatus(statusChannel, playersChannel, statusName, playersName, isOnline, client) {
    try {
        await statusChannel?.setName(statusName);
        try {
            await playersChannel?.permissionOverwrites.edit(playersChannel.guild.roles.everyone, {
                    ViewChannel: isOnline
            });
        } catch (error) {
            let botPermissions = getBotPermissions(playersChannel);
            console.warn(
                `Error updating channel visibility while updating server status
                    Channel ID: ${playersChannel.id}
                    Permissions: ${botPermissions}
                    Guild ID: ${playersChannel.guildId}`
            )
        }
        await playersChannel?.setName(playersName);
    } catch (error) {
        if (error instanceof 'RateLimitError') {
            let channel = client.channels.cache.get(error.majorParameter);
            console.log(`Reached the rate limit while renaming channel ${channel.id} in guild ${channel.guildId}`);
        } else {
            console.log(error);
            return; // Remove when all fields are set
            let botPermissions = getBotPermissions(playersChannel);
            console.warn(
                `Error renaming channels while updating server status
                    Channel ID: 
                    Permissions: ${botPermissions}
                    Guild ID: `
            )
        }
    }
}

async function getBotPermissions(channel) {
    let botPermissions = channel.permissionsFor(channel.guild.me).serialize();
    const filteredPermissions = [];
    let filteredBotPermissions = Object.keys(botPermissions)
        .filter(permission => filteredPermissions.includes(permission))
        .reduce((obj, key) => {
            obj[key] = botPermissions[key];
            return obj;
        }, {});
    return filteredBotPermissions;
}