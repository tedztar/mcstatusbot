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
                let online = !err ? true : false;
                let statusName = online ? 'Status: Online' : 'Status: Offline';
                let playersName = online ? `Players: ${res.players?.online ?? '?'} / ${res.players?.max ?? '?'}` : 'Players: 0';
                await setStatus(statusChannel, playersChannel, statusName, playersName);
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

async function setStatus(statusChannel, playersChannel, statusName, playersName) {
    try {
        await statusChannel?.setName(statusName);
        try {
            await playersChannel?.permissionOverwrites.edit(playersChannel.guild.roles.everyone, {
                    ViewChannel: false
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
        console.log(error);
        if (true) { // Logic to handle whether error is RateLimitError
                console.log(`Reached the rate limit while renaming channel ${} in guild ${}`);
                await sendMessage.newBasicMessage(interaction, 'The rate limit for this channel has been reached, please try renaming this server in a few minutes!');
        } else {
            return; // Remove when all fields are set
            let botPermissions = getBotPermissions(playersChannel);
            console.warn(
                `Error renaming channels while updating server status
                    Channel ID: ${}
                    Permissions: ${botPermissions}
                    Guild ID: ${}`
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