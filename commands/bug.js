const { SlashCommandBuilder } = require('@discordjs/builders');
const sendMessage = require('../functions/sendMessage');
const nodemailer = require('nodemailer');
var profanity = require('@2toad/profanity').profanity;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bug')
		.setDescription('Send a bug report to maintainers')
		.addStringOption((option) => option.setName('bug').setDescription('Description of the bug').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		//configure mailer
		let transporter = nodemailer.createTransport({
			host: process.env.EM_HOST,
			port: process.env.EM_PORT,
			secure: true,
			auth: {
				user: process.env.EM_USER,
				pass: process.env.EM_PASS
			}
		});

		const bug = interaction.options.getString('bug');

		if (!bug) {
			await sendMessage.newBasicMessage(interaction, 'Please specify a bug that you would like to report.');
			return;
		} else {
			if (profanity.exists(bug)) {
				await sendMessage.newBasicMessage(interaction, 'Your query triggered our spam protection. Please try again, or open a github issue.');
				return;
			} else {
				await transporter.sendMail({
					from: `"MCStatusBot" <${process.env.EM_USER}>`,
					to: `${process.env.EM_R1}, ${process.env.EM_R2}`,
					subject: `Bug Report - ${interaction.user.username}, ${interaction.guildId}`,
					text: `${bug}`
				});

				await sendMessage.newBasicMessage(interaction, 'Thank You for reporting a bug and helping to improve this bot! Your feedback is greatly appreciated!');
			}
		}
	}
};
