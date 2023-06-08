import { logWarning } from '../functions/consoleLogging.js';
import { getKey, setKey } from '../functions/databaseFunctions.js';
import { getServerStatus } from '../functions/getServerStatus.js';
import { renameChannels } from '../functions/renameChannels.js';

export async function updateServers(client) {
	// Update server count badge
	if (client.cluster.id == 0) {
		try {
			let serverCountByShard = await client.cluster.fetchClientValues('guilds.cache.size');
			let serverCount = serverCountByShard.reduce((totalGuilds, shardGuilds) => totalGuilds + shardGuilds, 0);
			await setKey('discordServers', serverCount);
		} catch (error) {
			if (error.name != 'Error [ShardingInProcess]') logWarning('Error setting server count', error);
		}
	}

	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			let serverList = await getKey(guild.id);
			await Promise.allSettled(
				serverList.map(async (server) => {
					let serverStatus;
					try {
						serverStatus = await getServerStatus(server.ip);
					} catch (error) {
						logWarning('Error pinging Minecraft server while updating servers', {
							'Server IP': server.ip,
							'Guild ID': guild.id,
							Error: serverStatus.error || error
						});
					}
					const channels = [
						{ object: await guild.channels.cache.get(server.statusId), name: 'statusName' },
						{ object: await guild.channels.cache.get(server.playersId), name: 'playersName' }
					];
					await renameChannels(channels, serverStatus);
				})
			);
		})
	);
}
