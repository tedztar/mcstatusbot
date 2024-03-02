import 'dotenv/config';
import { beaver } from '../functions/consoleLogging.js';
import { getServers } from '../functions/databaseFunctions.js';
import { getServerStatus } from '../functions/getServerStatus.js';
import { renameChannels } from '../functions/renameChannels.js';
import { parentPort } from 'node:worker_threads';
import { client } from '../bot.js';

const updateServers = async () => {
	// Update server count badge on remote
	if (process.env.NODE_ENV == 'production' && client.cluster.id == 0) {
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
			if (!error.name.include('ShardingInProcess')) {
				beaver.log('update-servers', 'Error updating server count badge on remote', error);
			}
		}
	}

	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			const serverList = await getServers(guild.id);
			await Promise.allSettled(
				serverList.map(async (server) => {
					const statusChannel = guild.channels.cache.get(server.statusId);
					const playersChannel = guild.channels.cache.get(server.playersId);

					let serverStatus;

					try {
						serverStatus = await getServerStatus(server);
					} catch (error) {
						if (!server.ip.includes('_')) {
							beaver.log(
								'update-servers',
								'Error pinging Minecraft server while updating servers',
								JSON.stringify({
									'Server IP': server.ip
								}),
								error
							);
						}

						return false;
					}

					const channels = [
						{ object: statusChannel, type: 'status' },
						{ object: playersChannel, type: 'players' }
					];

					await renameChannels(channels, serverStatus, 'low_priority');
				})
			);
		})
	);
};

parentPort.on('message', async (_) => {
	await updateServers();
});
