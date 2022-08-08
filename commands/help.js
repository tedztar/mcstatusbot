const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription("List the other commands"),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		
		const helpEmbed = new Discord.EmbedBuilder()
			.setTitle('Commands:')
			.setColor(embedColor)
			.addFields(
				{ name: '/status [ip]', value: 'Displays the current status and active players for your server' },
				{ name: '/monitor ip', value: 'Monitor the server with the specified IP address' },
				{ name: '/unmonitor ip|all', value: 'Unmonitor the server with the specified IP address or all servers' },
			);
		await interaction.editReply({ embeds: [helpEmbed], ephemeral: true });
	},
};