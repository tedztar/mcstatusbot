const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const removeServer = require('../functions/removeServer');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmonitor')
		.setDescription('Unmonitor the specified server or all servers')
		.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false)),
	async execute(interaction) {
		// Check if member has administrator permission
		if (!interaction.memberPermissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
			await sendMessage.newBasicMessage(interaction, 'You must have the administrator permission to use this command!');
			return;
		}

		// Check if there are any servers to unmonitor
		const monitoredServers = (await serverDB.get(interaction.guildId)) || [];
		if (!monitoredServers.length) {
			await sendMessage.newBasicMessage(interaction, 'There are no servers to unmonitor!');
			return;
		}

		// Check if there are multiple servers to unmonitor and none were specified
		if (!interaction.options.getString('server') && monitoredServers.length > 1) {
			await sendMessage.newBasicMessage(interaction, 'Please specify a server to unmonitor!');
			return;
		}

		// Unmonitor all servers if specified
		if (interaction.options.getString('server') == 'all') {
			for (const server of monitoredServers) {
				await removeServer.execute(interaction.guild, server);
			}
			await sendMessage.newBasicMessage(interaction, 'The channels have been removed successfully.');
			return;
		}

		let server;

		// Find the server to unmonitor
		if (interaction.options.getString('server')) {
			let serverIndex = await monitoredServers.findIndex((server) => server.nickname == interaction.options.getString('server'));
			serverIndex == -1 ? (serverIndex = await monitoredServers.findIndex((server) => server.ip == interaction.options.getString('server'))) : null;
			server = serverIndex != -1 ? monitoredServers[serverIndex] : null;
		} else {
			// Find the default server
			let defaultServerIndex = await monitoredServers.findIndex((server) => server.default);
			serverIp = defaultServerIndex == -1 ? null : monitoredServers[defaultServerIndex].ip;
		}

		// Check if the server is being monitored
		if (!server) {
			await sendMessage.newBasicMessage(interaction, 'The server you have specified was not already being monitored!');
			return;
		}

		// Check if the server being unmonitored is the default server for all commands
		if (server.default && monitoredServers.length > 1) {
			await sendMessage.newBasicMessage(
				interaction,
				'You have more than one server monitored, and the server you are trying to unmonitor is the default server. Please set a new default first!'
			);
			return;
		}

		// Unmonitor the server
		await removeServer.execute(interaction.guild, server);

		await sendMessage.newBasicMessage(interaction, 'The channels have been removed successfully.');
	}
};
