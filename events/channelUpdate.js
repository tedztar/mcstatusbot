const { Events } = require('discord.js');
const { isMissingPermissions } = require('../functions/botPermissions');
const { getMonitoredServers, setMonitoredServers } = require('../functions/databaseFunctions');
const { findServer } = require('../functions/findServer');
const { isNotMonitored } = require('../functions/inputValidation');

const name = Events.ChannelUpdate;
const once = false;

async function execute(_, newChannel) {
	if (await isMissingPermissions('channel', newChannel.id)) return;

	// Check if the updated channel is in the list of monitored channels
	server = await findServer(newChannel.id, ['categoryId'], newChannel.guildId);
	if (await isNotMonitored(server)) return;

	// Check if the channel name is the same as the nickname listed in the database
	if (newChannel.name == server.nickname || newChannel.name == server.ip) return;

	// Set the nickname listed in the database to the channel name
	let monitoredServers = await getMonitoredServers(newChannel.guildId);
	server.nickname = newChannel.name;
	await setMonitoredServers(newChannel.guildId, monitoredServers);
}

module.exports = { name, once, execute };
