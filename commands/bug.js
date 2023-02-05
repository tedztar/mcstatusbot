const { SlashCommandBuilder } = require('@discordjs/builders');
const sendMessage = require('../functions/sendMessage');
const profanity = require('@2toad/profanity').profanity;
const createIssue = require('github-create-issue');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bug')
		.setDescription('Send a bug report to maintainers')
		.addStringOption((option) => option.setName('description').setDescription('Description of the bug').setRequired(true)),
	async execute(interaction) {
		const bug = interaction.options.getString('description');

		if (profanity.exists(bug)) {
			await sendMessage.newBasicMessage(interaction, 'Your query triggered our spam protection. Please try again, or open a github issue.');
			return;
		}

		createIssue(
			'RahulR100/mcstatusbot',
			bug,
			{
				token: process.env.ISSUE_TOKEN
			},
			async function (error, _, _) {
				if (error) {
					console.log(error);
					await sendMessage.newBasicMessage(interaction, 'There was an error submitting your issue. Please try again in a few minutes.');
					return;
				}
				await sendMessage.newBasicMessage(interaction, 'Thank you for your feedback!');
			}
		);
	}
};
