const { SlashCommandBuilder } = require('@discordjs/builders');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bug')
		.setDescription('Send a bug report to maintainers'),
	async execute(interaction) {
		await sendMessage.newBasicMessage(interaction, 'Report a bug by opening an issue on our [GitHub repository](https://github.com/RahulR100/mcstatusbot/issues).');
	}
};
