const { SlashCommandBuilder } = require('discord.js');
const { sendMessage } = require('../functions/sendMessage');

const data = new SlashCommandBuilder()
	.setName('bug')
	.setDescription('Send a bug report to maintainers');

async function execute(interaction) {
	await sendMessage(interaction, 'Report a bug by opening an issue in our [GitHub repository](https://github.com/RahulR100/mcstatusbot/issues).');
}

module.exports = { data, execute };
