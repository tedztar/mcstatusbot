const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendMessage } = require('../functions/sendMessage');
const { isMissingPermissions, getMissingPermissions } = require('../functions/botPermissions');
const { findServer, findDefaultServer, findServerIndex } = require('../functions/findServer');
const { getMonitoredServers, setMonitoredServers } = require('../functions/databaseFunctions');
const { noMonitoredServers, isServerUnspecified, removingDefaultServer, isNotMonitored } = require('../functions/inputValidation');

const data = new SlashCommandBuilder()
	.setName('unmonitor')
	.setDescription('Unmonitor the specified server or all servers')
	.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.setDMPermission(false);

async function execute(interaction) {
	if (await noMonitoredServers(interaction.guildId, interaction)) return;
	if (await isServerUnspecified(interaction.options.getString('server'), interaction.guildId, interaction)) return;

	// Unmonitor all servers if specified
	if (interaction.options.getString('server') == 'all') {
		let notUnmonitored = [];
		let notDeleted = [];
		let monitoredServers = await getMonitoredServers(interaction.guild.id);
		for (const server of monitoredServers) {
			let skipServer = false;
			const channelIds = [server.categoryId, server.statusId, server.playersId];

			// Check if the bot has the required permissions
			for (const channelId of channelIds) {
				let type = channelId == server.categoryId ? 'category' : 'channel';
				if (await isMissingPermissions(type, interaction.guild.channels.cache.get(channelId))) {
					let missingPermissions = getMissingPermissions(type, interaction.guild.channels.cache.get(channelId));
					notUnmonitored.push({
						name: server.nickname || server.ip,
						type,
						missingPermissions
					})
					skipServer = true;
					break;
				}
			}
			if (skipServer) continue;

			try {
				await removeServer(server, interaction.guild);
			} catch (error) {
				notDeleted.push(server.nickname || server.ip);
			}
		}

		console.log(`All servers were unmonitored for guild ${interaction.guildId}`);

		if (!notUnmonitored.length && !notDeleted.length) {
			await sendMessage(interaction, 'The channels have successfully been removed.');
		}
		else {
			let notUnmonitoredList = notUnmonitored.map((server) => {
				return `${server.name} (${server['type'][0].toUpperCase() + server.type.slice(1)}): ${server.missingPermissions}`;
			}).join('\n');
			let notDeletedList = notDeleted.join(', ');
			await sendMessage(interaction,
				`There was an error while unmonitoring some of the servers!	
				${notUnmonitored.length ? `
				The following servers need the required category and/or channel permissions before you can unmonitor them:
				${notUnmonitoredList}` : ''}
				${notDeleted.length ? `
				The following servers were unmonitored, but the channels need to be removed manually:
				${notDeletedList}` : ''}`
			);
		}
		return;
	}

	let server;

	if (interaction.options.getString('server')) {
		server = await findServer(interaction.options.getString('server'), ['ip', 'nickname'], interaction.guildId);
		if (await isNotMonitored(server, interaction)) return;
	}
	else {
		server = await findDefaultServer(interaction.guildId);
	}

	if (await removingDefaultServer(server, interaction.guildId, interaction)) return;

	// Check if the bot has the required permissions
	const channelIds = [server.categoryId, server.statusId, server.playersId];
	for (const channelId of channelIds) {
		type = channelId == server.categoryId ? 'category' : 'channel';
		if (await isMissingPermissions(type, interaction.guild.channels.cache.get(channelId), interaction)) return;
	}

	// Unmonitor the server
	try {
		await removeServer(server, interaction.guild);
	} catch (error) {
		await sendMessage(interaction, 'There was an error while deleting some of the channels. Please delete them manually!');
		return;
	}

	console.log(`${server.ip} was unmonitored for guild ${interaction.guildId}`);

	await sendMessage(interaction, 'The server has successfully been unmonitored.');
}

async function removeServer(server, guild) {
	// Remove server from database
	let monitoredServers = await getMonitoredServers(guild.id);
	let serverIndex = await findServerIndex(server, guild.id);
	monitoredServers.splice(serverIndex, 1);
	await setMonitoredServers(guild.id, monitoredServers);

	// Remove channels and server category
	const channels = [
		await guild.channels.cache.get(server.statusId),
		await guild.channels.cache.get(server.playersId),
		await guild.channels.cache.get(server.categoryId)
	];
	for (const channel of channels) {
		try {
			channel?.delete();
		} catch (error) {
			console.warn(
				`Error deleting channel while removing server from guild
                        Channel ID: ${channel.id}
                        Guild ID: ${guild.id}
                        Server IP: ${server.ip}`
			);
			throw error;
		}
	}
}

module.exports = { data, execute };
