const { EmbedBuilder } = require('discord.js');

const embedColor = '#7289DA';

async function sendMessage(interaction, message, title) {
	const responseEmbed = new EmbedBuilder().setDescription(message).setColor(embedColor);
	title ? responseEmbed.setTitle(title) : null;
	await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
}

module.exports = { embedColor, sendMessage };
