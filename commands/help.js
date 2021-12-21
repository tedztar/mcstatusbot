const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription("View all of the bot's commands"),
	async execute(interaction) {
		const helpEmbed = new Discord.MessageEmbed()
			.setTitle('Commands:')
			.setColor(embedColor)
			.addFields(
				{ name: '/status', value: 'Displays the current status and active players for your server' },
				{ name: '/monitor [ip]', value: 'Monitor the server with the specified IP address' },
				{ name: '/unmonitor [ip]', value: 'Unmonitor the server with the specified IP address' },
			);
		await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
	},
};