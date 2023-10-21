'use strict';
import { getMissingPermissions } from './botPermissions.js';
import { logWarning } from './consoleLogging.js';

export async function renameChannels(channels, serverStatus, priority = null) {
	const channelNames = {
		status: serverStatus.online ? 'Status: Online' : 'Status: Offline',
		players: serverStatus.players ? `Players: ${serverStatus.players.online} / ${serverStatus.players.max}` : 'Players: 0'
	};

	await Promise.allSettled(
		channels.map(async (channel) => {
			try {
				if (channelNames[channel.type] == channel.object?.name) return;
				await channel.object?.setName(channelNames[channel.type], priority);
				if (channel.type == 'players') {
					try {
						await channel.object?.permissionOverwrites.edit(channel.object.guild.roles.everyone, {
							ViewChannel: serverStatus.online
						}, { reason: priority });
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
