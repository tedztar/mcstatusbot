'use strict';
import { updateQueue } from '../bot.js';
import { beaver } from './consoleLogging.js';
import { getServers } from './databaseFunctions.js';

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
			if (error.name != 'Error [ShardingInProcess]') {
				beaver.log('update-servers', 'Error updating server count badge on remote', error);
			}
		}
	}

	// Send all servers to queue to be updated by worker
	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			const serverList = await getServers(guild.id);
			await Promise.allSettled(
				serverList.map(async (server) => {
					const statusChannel = await guild.channels.cache.get(server.statusId);
					const playersChannel = await guild.channels.cache.get(server.playersId);

					await updateQueue.add('updateServer', {
						statusChannel,
						playersChannel,
						server
					});
				})
			);
		})
	);
}
