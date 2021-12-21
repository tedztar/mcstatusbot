const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmonitor')
		.setDescription('Remove a Minecraft server from the monitor list'),
	async execute(interaction) {

	},
};