const { getMissingPermissions } = require('./botPermissions');
const { logWarning } = require('./consoleLogging');

async function renameChannels(channels, serverStatus) {
	const channelNames = {
		statusName: serverStatus.isOnline ? 'Status: Online' : 'Status: Offline',
		playersName: serverStatus.isOnline ? `Players: ${serverStatus.players?.online ?? '?'} / ${serverStatus.players?.max ?? '?'}` : 'Players: 0'
	};

	await Promise.allSettled(
		channels.map(async (channel) => {
			try {
				await channel.object?.setName(channelNames[channel.name]);
				if (channel.name == 'playersName') {
					try {
						await channel.object?.permissionOverwrites.edit(channel.object.guild.roles.everyone, {
							ViewChannel: serverStatus.isOnline
						});
					} catch (error) {
						if (!error.name.includes('RateLimitError')) {
							if (process.env.DETAILED_LOGS) {
								logWarning('Error changing channel visibility while updating server status', {
									'Channel ID': channel.object.id,
									'Guild ID': channel.object.guildId,
									'Missing Permissions': getMissingPermissions('channel', channel.object) || 'None',
									Error: error
								});
							}
						}
					}
				}
			} catch (error) {
				if (!error.name.includes('RateLimitError')) {
					if (process.env.DETAILED_LOGS) {
						logWarning('Error renaming channels while updating server status', {
							'Channel ID': channel.object.id,
							'Guild ID': channel.object.guildId,
							'Missing Permissions': getMissingPermissions('channel', channel.object) || 'None',
							Error: error
						});
					}
				}
			}
		})
	);
}

module.exports = { renameChannels };
