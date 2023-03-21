const { getMissingPermissions } = require('./botPermissions');
const { logWarning, logSuccess } = require('./consoleLogging');

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
                    logWarning(
                        `Error updating channel visibility while updating server status
                                Channel ID: ${channel.object.id}
                                Permissions: ${permissions}
                                Guild ID: ${channel.object.guildId}`,
                        error
                    )
                }
            }
        } catch (error) {
            if (error.name.includes('RateLimitError')) {
                logSuccess(`Reached the rate limit while renaming channel ${channel.object.id} in guild ${channel.object.guildId}`);
            } else {
                let permissions = getMissingPermissions('channel', channel.object);
                logWarning(
                    `Error renaming channels while updating server status
                        Channel ID: ${channel.object.id}
                        Permissions: ${permissions}
                        Guild ID: ${channel.object.guildId}`,
                    error
                )
            }
        }
    }
}

module.exports = { renameChannels };
