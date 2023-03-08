const { EmbedBuilder } = require('discord.js');

module.exports = {
	embedColor: '#7289DA',
	async sendMessage(interaction, message, title) {
		const responseEmbed = new EmbedBuilder().setDescription(message).setColor(embedColor);
		title ? responseEmbed.setTitle(title) : null;
		await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
	}
};
