const { Events } = require('discord.js');
const { logWarning } = require('../functions/consoleLogging');
const { getKey, setKey } = require('../functions/databaseFunctions');
const { findServer, findServerIndex } = require('../functions/findServer');
const { isNotMonitored } = require('../functions/inputValidation');

const name = Events.ChannelUpdate;
const once = false;

async function execute(_, newChannel) {
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

module.exports = { name, once, execute };
