const { getMissingPermissions } = require('./botPermissions');

async function renameChannels(channels, serverStatus) {
    const channelNames = {
        statusName: serverStatus.isOnline ? 'Status: Online' : 'Status: Offline',
        playersName: serverStatus.isOnline ? `Players: ${serverStatus.players?.online ?? '?'} / ${serverStatus.players?.max ?? '?'}` : 'Players: 0'
    }

    for (const channel of channels) {
        try {
            await channel.object?.setName(channelNames[channel.name]);
            if (channel.name == 'playersName') {
                try {
                    await channel.object?.permissionOverwrites.edit(channel.object.guild.roles.everyone, {
                        ViewChannel: serverStatus.isOnline
                    });
                } catch (error) {
                    let permissions = getMissingPermissions('channel', channel.object);
                    console.warn(
                        `Error updating channel visibility while updating server status
                                Channel ID: ${channel.object.id}
                                Permissions: ${permissions}
                                Guild ID: ${channel.object.guildId}`
                    )
                }
            }
        } catch (error) {
            if (error instanceof 'RateLimitError') {
                console.log(`Reached the rate limit while renaming channel ${channel.object.id} in guild ${channel.object.guildId}`);
            } else {
                let permissions = getMissingPermissions('channel', channel.object);
                console.warn(
                    `Error renaming channels while updating server status
                        Channel ID: ${channel.object.id}
                        Permissions: ${permissions}
                        Guild ID: ${channel.object.guildId}`
                )
            }
        }
    }
}

module.exports = { renameChannels };
