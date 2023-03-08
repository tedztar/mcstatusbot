const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendMessage } = require('../functions/sendMessage');
const { isMissingPermissions } = require('../functions/botPermissions');
const { findServer, findDefaultServer } = require('../functions/findServer');
const { getMonitoredServers, setMonitoredServers } = require('../functions/databaseFunctions');
const { noMonitoredServers, isServerUnspecified, removingDefaultServer } = require('../functions/inputValidation');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmonitor')
		.setDescription('Unmonitor the specified server or all servers')
		.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDMPermission(false),
	async execute(interaction) {
		if (await noMonitoredServers(interaction.guildId, interaction)) return;
		if (await isServerUnspecified(interaction.options.getString('server'), interaction.guildId, interaction)) return;

		// Unmonitor all servers if specified
		if (interaction.options.getString('server') == 'all') {
			let deletedAll = true;
			for (const server of monitoredServers) {
				// Check if the bot has the required permissions
				const channelIds = [server.categoryId, server.statusId, server.playersId];
				for (const channelId of channelIds) {
					if (await isMissingPermissions('channel', channelId, interaction)) return;
				}

				try {
					await removeServer(interaction.guild, server);
				} catch (error) {
					deletedAll = false;
					await sendMessage(interaction, 'There was an error while deleting some of the channels. You might have to delete them manually!');
				}
			}
			if (deletedAll) {
				console.log(`All servers were unmonitored for guild ${interaction.guildId}`);
				await sendMessage(interaction, 'The channels have successfully been removed.');
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

		if (await removingDefaultServer(interaction.options.getString('server'), interaction.guildId, interaction)) return;

		// Check if the bot has the required permissions
		const channelIds = [server.categoryId, server.statusId, server.playersId];
		for (const channelId of channelIds) {
			if (await isMissingPermissions('channel', channelId, interaction)) return;
		}

		// Unmonitor the server
		try {
			await removeServer(server, interaction.guild);
		} catch (error) {
			await sendMessage(interaction, 'There was an error while deleting the channels. You might have to delete them manually!');
			return;
		}

		console.log(`${server.ip} was unmonitored for guild ${interaction.guildId}`);

		await sendMessage(interaction, 'The channels have been removed successfully.');
	}
};

async function removeServer(server, guild) {
	// Remove channels and server category
	const channels = [
		await guild.channels.cache.get(server.statusId),
		await guild.channels.cache.get(server.playersId),
		await guild.channels.cache.get(server.categoryId)
	];
	for (const channel of channels) {
		try {
			await channel?.delete();
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

	// Remove server from database
	let monitoredServers = getMonitoredServers(guild.id);
	serverIndex = await monitoredServers.indexOf(server);
	await monitoredServers.splice(serverIndex, 1);
	await setMonitoredServers(guild.id, monitoredServers);
}
