const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const Discord = require("discord.js");
const settings = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Change the settings of the bot!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ip')
				.setDescription('Change the IP address of the server being monitored')
				.addStringOption(option =>
					option
						.setName('value')
						.setDescription('IP address')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('port')
				.setDescription('Change the port of the server being monitored')
				.addIntegerOption(option =>
					option
						.setName('value')
						.setDescription('Port of the server being monitored')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('protocolversion')
				.setDescription('Change the protocol version of the server being monitored')
				.addStringOption(option =>
					option
						.setName('value')
						.setDescription('Protocol version number')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('pinginterval')
				.setDescription("Change how often the bot checks the server's status")
				.addIntegerOption(option =>
					option
						.setName('value')
						.setDescription('Time (seconds)')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('maxplayers')
				.setDescription('Change the IP address of the server being monitored')
				.addStringOption(option =>
					option
						.setName('value')
						.setDescription("Use 'default' for MC server capacity, 'memberCount' for Discord server member count, or a number")
						.setRequired(true)
				)
		),
	async execute(interaction) {
		const name = interaction.options.getSubcommand();
		const value = interaction.options.getString('value');
		fs.readFile('config.json', 'utf8', function (err, data) {
			if (err) {
				return console.log(err);
			}

			const regex = new RegExp('(?<="' + name + '": ").*(?=")');
			const result = data.replace(regex, value);

			fs.writeFile('config.json', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
		});
		const responseEmbed = new Discord.MessageEmbed()
			.setDescription('Changed ' + name + ' to ' + value)
			.setColor(settings.embedcolor)
		await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
		process.exit();
	},
};