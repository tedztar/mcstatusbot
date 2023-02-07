const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('default')
		.setDescription('Set a server to be the default for all commands')
		.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false)),
	async execute(interaction) {
		// Check if the member has the administrator permission
		if (!interaction.memberPermissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
			await sendMessage.newBasicMessage(interaction, 'You must have the administrator permission to use this command!');
			return;
		}

        // Check if there are any servers to make the default
		const monitoredServers = (await serverDB.get(interaction.guildId)) || [];
		if (!monitoredServers.length) {
			await sendMessage.newBasicMessage(interaction, 'There are no servers to make the default!');
			return;
		}
		if (monitoredServers.length == 1) {
			await sendMessage.newBasicMessage(interaction, 'You only have 1 monitored server and it is already the default!');
			return;
		}

		// List the default server if no server is specified
		let defaultServerIndex = await monitoredServers.findIndex((server) => server.default) || 0;
		let oldDefaultServer = monitoredServers[defaultServerIndex];
		if(!interaction.options.getString('server')) {
			await sendMessage.newMessageWithTitle(interaction, oldDefaultServer.nickname || oldDefaultServer.ip, 'Default Server:');
			return;
		}

		// Find the server to make the default
		let serverIndex = await monitoredServers.findIndex((server) => server.nickname == interaction.options.getString('server'));
		serverIndex == -1 ? serverIndex = await monitoredServers.findIndex((server) => server.ip == interaction.options.getString('server')) : null;
		let server = serverIndex != -1 ? monitoredServers[serverIndex] : null;

		// Check if the server is being monitored
		if (!server) {
			await sendMessage.newBasicMessage(interaction, 'The server you have specified was not already being monitored!')
			return;
		}

		//Check if the server is already the default server
		if (server.default) {
			await sendMessage.newBasicMessage(interaction, 'The server you have specified is already the default server!')
			return;
		}

		// Change the default server
		oldDefaultServer.default = false;
		server.default = true;
        await serverDB.set(interaction.guildId, monitoredServers);

		await sendMessage.newBasicMessage(interaction, 'The server has successfully been made the default for all commands.');
	}
};
