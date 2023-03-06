const { EmbedBuilder } = require('discord.js');

module.exports = {
	async newBasicMessage(interaction, message) {
		const responseEmbed = new EmbedBuilder().setDescription(message).setColor(embedColor);
		await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
	},
	async newMessageWithTitle(interaction, title, message) {
		const responseEmbed = new EmbedBuilder().setTitle(title).setDescription(message).setColor(embedColor);
		await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
	}
};
