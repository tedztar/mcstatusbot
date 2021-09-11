const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require('../config.json');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription("Restart the bot if it's not working correctly"),
	async execute(interaction) {
		const restartingEmbed = new Discord.MessageEmbed()
			.setDescription('Restarting the bot...')
			.setColor(settings.embedcolor)
		const restartedEmbed = new Discord.MessageEmbed()
			.setDescription('Bot restarted!')
			.setColor(settings.embedcolor)
		await interaction.reply({ embeds: [restartingEmbed], ephemeral: true });
		await sleep(1000);
		await interaction.editReply({ embeds: [restartedEmbed], ephemeral: true });
		process.exit();
	},
};