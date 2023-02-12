const Discord = require('discord.js');

module.exports = {
	async newBasicMessage(interaction, message) {
		const responseEmbed = new Discord.EmbedBuilder().setDescription(message).setColor(embedColor);
		await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
	},
	async newMessageWithTitle(interaction, title, message) {
		const responseEmbed = new Discord.EmbedBuilder().setTitle(title).setDescription(message).setColor(embedColor);
		await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
	}
};
