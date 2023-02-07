const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nickname')
		.setDescription('Change the nickname of a monitored Minecraft server')
		.addStringOption((option) => option.setName('nickname').setDescription('Server nickname').setRequired(true))
		.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false)),
	async execute(interaction) {
		// Check if the member has the administrator permission
		if (!interaction.memberPermissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
			await sendMessage.newBasicMessage(interaction, 'You must have the administrator permission to use this command!');
			return;
		}

		// Check if the bot has the manage roles permission
		if (!interaction.guild.roles.botRoleFor(interaction.client.user).permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) {
			await sendMessage.newBasicMessage(interaction, 'This bot needs the "manage roles" permission in order to rename channels!');
			return;
		}

		// Check if there are any servers to rename
		const monitoredServers = (await serverDB.get(interaction.guildId)) || [];
		if (!monitoredServers.length) {
			await sendMessage.newBasicMessage(interaction, 'There are no servers to rename!');
			return;
		}

		// Check if the nickname is already being used
		nicknameIndex = await monitoredServers.findIndex((server) => server.nickname == interaction.options.getString('nickname'));
		if (interaction.options.getString('nickname') && nicknameIndex != -1) {
			await sendMessage.newBasicMessage(interaction, 'This nickname is already being used!');
			return;
		}

		let server;

		// Find the server to rename
		if (interaction.options.getString('server')) {
			let serverIndex = await monitoredServers.findIndex((server) => server.nickname == interaction.options.getString('server'));
			serverIndex == -1 ? (serverIndex = await monitoredServers.findIndex((server) => server.ip == interaction.options.getString('server'))) : null;
			server = serverIndex != -1 ? monitoredServers[serverIndex] : null;
		} else {
			// Find the default server
			let defaultServerIndex = (await monitoredServers.findIndex((server) => server.default)) || 0;
			server = monitoredServers[defaultServerIndex];
		}

		// Check if the server is being monitored
		if (!server) {
			await sendMessage.newBasicMessage(interaction, 'The server you have specified was not already being monitored!');
			return;
		}

		// Rename the server category
		try {
			await interaction.guild.channels.cache.get(server.categoryId).setName(interaction.options.getString('nickname'));
		} catch (rateLimit) {
			await sendMessage.newBasicMessage(interaction, 'The rate limit has been reached, please try renaming this server in a few minutes!');
			return;
		}

		// Change the server nickname in the database
		server.nickname = interaction.options.getString('nickname');
		await serverDB.set(interaction.guildId, monitoredServers);

		await sendMessage.newBasicMessage(interaction, 'The server has successfully been renamed.');
	}
};
