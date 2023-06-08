'use strict';
import { Events } from 'discord.js';
import { logWarning } from '../functions/consoleLogging.js';
import { getKey, setKey } from '../functions/databaseFunctions.js';
import { findServer, findServerIndex } from '../functions/findServer.js';
import { isNotMonitored } from '../functions/inputValidation.js';

export const name = Events.ChannelUpdate;
export const once = false;

export async function execute(_, newChannel) {
	try {
		// Check if the updated channel is in the list of monitored channels
		let server = await findServer(newChannel.id, ['categoryId'], newChannel.guildId);
		if (await isNotMonitored(server)) return;

		// Check if the channel name is the same as the nickname listed in the database
		if (newChannel.name == server.nickname || newChannel.name == server.ip) return;

		// Set the nickname listed in the database to the channel name
		let monitoredServers = await getKey(newChannel.guildId);
		const serverIndex = await findServerIndex(server, newChannel.guildId);
		monitoredServers[serverIndex].nickname = newChannel.name;
		await setKey(newChannel.guildId, monitoredServers);
	} catch (error) {
		logWarning('Error setting nickname during channel rename', {
			'Channel ID': newChannel.id,
			'Guild ID': newChannel.guildId,
			Error: error
		});
	}
}
