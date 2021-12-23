const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const removeServer = require('../functions/removeServer.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmonitor')
		.setDescription('Remove a Minecraft server from the monitor list')
		.addStringOption(option =>
			option
				.setName('ip')
				.setDescription('IP address')
				.setRequired(true)
		),
	async execute(interaction) {
		// Check if member has administrator permission
		if (!interaction.memberPermissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
			const responseEmbed = new Discord.MessageEmbed()
				.setDescription('You must have the administrator permission to use this command!')
				.setColor(embedColor)
			await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
			return;
		}

		// Get server from database
		let monitoredServers = await serverDB.get(interaction.guildId) ? await serverDB.get(interaction.guildId) : [];
		if (interaction.options.getString('ip') == 'all') {
			for (const server of monitoredServers) {
				await removeServer.execute(interaction.guild, server);
			}
		}
		else {
			const serverIndex = monitoredServers ? monitoredServers.findIndex(server => server.ip == interaction.options.getString('ip')) : -1;
			if (serverIndex == -1) {
				const responseEmbed = new Discord.MessageEmbed()
					.setDescription('The IP address you have specified was not already being monitored.')
					.setColor(embedColor)
				await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
				return;
			}
			server = monitoredServers[serverIndex];
			removeServer.execute(interaction.guild, server);
		}

		const responseEmbed = new Discord.MessageEmbed()
			.setDescription('The channels have been removed successfully.')
			.setColor(embedColor)
		await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
	}
}