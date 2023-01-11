const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const removeServer = require('../functions/removeServer');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmonitor')
		.setDescription('Remove a Minecraft server from the monitor list')
		.addStringOption((option) => option.setName('ip').setDescription('IP address').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		// Check if member has administrator permission
		if (!interaction.memberPermissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
			await sendMessage.newBasicMessage(interaction, 'You must have the administrator permission to use this command!');
			return;
		}

		// Get server from database
		let monitoredServers = (await serverDB.get(interaction.guildId)) || [];
		if (interaction.options.getString('ip') == 'all') {
			for (const server of monitoredServers) {
				await removeServer.execute(interaction.guild, server);
			}
		} else {
			const serverIndex = monitoredServers ? monitoredServers.findIndex((server) => server.ip == interaction.options.getString('ip')) : -1;
			if (serverIndex == -1) {
				await sendMessage.newBasicMessage(interaction, 'The IP address you have specified was not already being monitored.');
				return;
			}
			server = monitoredServers[serverIndex];
			removeServer.execute(interaction.guild, server);
		}

		await sendMessage.newBasicMessage(interaction, 'The channels have been removed successfully.');
	}
};
