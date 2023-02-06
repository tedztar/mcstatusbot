const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('default')
		.setDescription('Set a server to be the default for all commands')
		.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(true)),
	async execute(interaction) {
		// Check if the member has the administrator permission
		if (!interaction.memberPermissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
			await sendMessage.newBasicMessage(interaction, 'You must have the administrator permission to use this command!');
			return;
		}

        // Check if there are any servers to make the default for all commands
		const monitoredServers = (await serverDB.get(interaction.guildId)) || [];
		if (!monitoredServers.length) {
			await sendMessage.newBasicMessage(interaction, 'There are no servers to make the default for all commands!');
			return;
		}
		if (monitoredServers.length == 1) {
			await sendMessage.newBasicMessage(interaction, 'You only have 1 monitored server and it is already the default for all commands!');
			return;
		}

		// Find the server to make the default for all commands
		let serverIndex = await monitoredServers.findIndex((server) => server.nickname == interaction.options.getString('server'));
		serverIndex == -1 ? serverIndex = await monitoredServers.findIndex((server) => server.ip == interaction.options.getString('server')) : null;
		let server = serverIndex != -1 ? monitoredServers[serverIndex] : null;

		// Check if the server is being monitored
		if (!server) {
			await sendMessage.newBasicMessage(interaction, 'The server you have specified was not already being monitored!')
			return;
		}

		// Change the default server for all commands
		for (const server of monitoredServers) {
			server.default = false;
		}
        server.default = true;
        await serverDB.set(interaction.guildId, monitoredServers);

		await sendMessage.newBasicMessage(interaction, 'The server has successfully been made the default for all commands.');
	}
};
