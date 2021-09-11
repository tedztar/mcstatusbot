const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Change the settings of the bot'),
	async execute(interaction) {
		const helpEmbed = new Discord.MessageEmbed()
			.setTitle('Commands:')
			.setColor(settings.embedcolor)
			.addFields(
				{ name: '/status', value: 'Displays the current status and active players for your server' },
				{ name: '/restart', value: "Restart the bot if it's not working correctly" },
				{ name: '/settings ip [string]', value: 'Change the IP address of the server being monitored' },
				{ name: '/settings port [integer]', value: 'Change the port of the server being monitored' },
				{ name: '/settings protocolVersion [integer]', value: 'Change the protocol version of the server being monitored. The values are based on the server version and are listed [here](https://wiki.vg/Protocol_version_numbers)' },
				{ name: '/settings pingInterval [integer]', value: "Change how often the bot checks the server's status (in seconds)" },
				{ name: "/settings maxPlayers ['default', 'memberCount', integer]", value: "Change the displayed max number of players online. 'default' sets this number to the Minecraft server's maximum capacity, 'memberCount' sets this number to the Discord server's member count, and an integer will display a static number" },
			);
		await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
	},
};