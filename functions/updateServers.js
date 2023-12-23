'use strict';
import { logWarning } from '../functions/consoleLogging.js';
import { getServers } from '../functions/databaseFunctions.js';
import { getServerStatus } from '../functions/getServerStatus.js';
import { renameChannels } from '../functions/renameChannels.js';

export async function updateServers(client) {
	// Update server count badge on remote
	if (client.cluster.id == 0) {
		try {
			let serverCountByShard = await client.cluster.fetchClientValues('guilds.cache.size');
			let serverCount = serverCountByShard.reduce((totalGuilds, shardGuilds) => totalGuilds + shardGuilds, 0);

			await fetch(process.env.DELEGATE_URL + '/count/set', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ count: serverCount, token: process.env.DELEGATE_TOKEN })
			});
		} catch (error) {
			if (error.name != 'Error [ShardingInProcess]') logWarning('Error setting server count', error);
		}
	}

	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			let serverList = await getServers(guild.id);
			await Promise.allSettled(
				serverList.map(async (server) => {
					let serverStatus;
					try {
						serverStatus = await getServerStatus(server);
					} catch (error) {
						!server.ip.includes('_') &&
							logWarning('Error pinging Minecraft server while updating servers', {
								'Server IP': server.ip,
								'Guild ID': guild.id,
								Error: error
							});
						return;
					}
					const channels = [
						{ object: await guild.channels.cache.get(server.statusId), type: 'status' },
						{ object: await guild.channels.cache.get(server.playersId), type: 'players' }
					];
					await renameChannels(channels, serverStatus, 'low_priority');
				})
			);
		})
	);
}
