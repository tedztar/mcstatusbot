const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('help').setDescription('List the other commands'),
	async execute(interaction) {
		const helpEmbed = new Discord.EmbedBuilder().setTitle('Commands:').setColor(embedColor).addFields(
			{
				name: '/status [server|ip]',
				value: 'Displays the current status and active players for any server'
			},
			{
				name: '/monitor ip [nickname] [default (true/false)]',
				value: 'Create 2 voice channels that display the status of a Minecraft server and optionally set a nickname'
			},
			{
				name: '/nickname nickname [server]',
				value: 'Change the nickname of a monitored Minecraft server'
			},
			{
				name: '/default [server]',
				value: 'Set a server to be the default for all commands'
			},
			{
				name: '/unmonitor [server|all]',
				value: 'Unmonitor the specified server or all servers'
			},
			{
				name: '/bug description',
				value: 'Send a bug report to the maintainers'
			}
		);
		await interaction.editReply({ embeds: [helpEmbed], ephemeral: true });
	}
};
