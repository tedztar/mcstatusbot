const { getMissingPermissions } = require('./botPermissions');
const { logWarning } = require('./consoleLogging');

async function renameChannels(channels, serverStatus) {
	const channelNames = {
		statusName: serverStatus.online ? 'Status: Online' : 'Status: Offline',
		playersName: serverStatus.players ? `Players: ${serverStatus.players.online} / ${serverStatus.players.max}` : 'Players: 0'
	};

	await Promise.allSettled(
		channels.map(async (channel) => {
			try {
				await channel.object?.setName(channelNames[channel.name]);
				if (channel.name == 'playersName') {
					try {
						await channel.object?.permissionOverwrites.edit(channel.object.guild.roles.everyone, {
							ViewChannel: serverStatus.online
						});
					} catch (error) {
						if (!error.name.includes('RateLimitError')) {
							let permissions = getMissingPermissions('channel', channel.object);
							if (!permissions) {
								logWarning('Error changing channel visibility while updating server status', {
									'Channel ID': channel.object.id,
									'Guild ID': channel.object.guildId,
									'Missing Permissions': permissions || 'None',
									Error: error
								});
							}
						}
					}
				}
			} catch (error) {
				if (!error.name.includes('RateLimitError')) {
					let permissions = getMissingPermissions('channel', channel.object);
					if (!permissions) {
						logWarning('Error renaming channels while updating server status', {
							'Channel ID': channel.object.id,
							'Guild ID': channel.object.guildId,
							'Missing Permissions': permissions || 'None',
							Error: error
						});
					}
				}
			}
		})
	);
}

module.exports = { renameChannels };
