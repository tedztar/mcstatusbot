const { SlashCommandBuilder } = require('@discordjs/builders');
const mcping = require('mcping-js');
const Discord = require('discord.js');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Displays the current status and active players for your server')
		.addStringOption((option) => option.setName('ip').setDescription('IP Address').setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const monitoredServers = (await serverDB.get(interaction.guildId)) || null;
		defaultIp = monitoredServers ? monitoredServers[0].ip : null;
		ipFull = interaction.options.getString('ip') || defaultIp;

		if (!ipFull) {
			await sendMessage.newBasicMessage(interaction, 'You must monitor a server or specify an IP address to use this command!');
			return;
		}

		ip = ipFull.split(':')[0];
		port = ipFull.split(':')[1] || 25565;
		const server = new mcping.MinecraftServer(ip, port);

		server.ping(2500, 47, async function (err, res) {
			if (err) {
				await sendMessage.newMessageWithTitle(interaction, `*The server is offline!*`, `Status for ${ipFull}:`);
				return;
			}

			if (!res.players.sample) {
				serverStatus = `*No one is playing!*`;
			} else {
				let onlinePlayers = [];
				for (var i = 0; i < res.players.sample.length; i++) {
					onlinePlayers.push(res.players.sample[i].name);
				}
				onlinePlayers = onlinePlayers
					.sort()
					.join(', ')
					.replace(/\u00A7[0-9A-FK-OR]|\\n/gi, '');
				serverStatus = `**${res.players.online || 0}/${res.players.max}** player(s) online.\n\n${onlinePlayers}`;
			}

			const responseEmbed = new Discord.EmbedBuilder()
				.setTitle(`Status for ${ipFull}:`)
				.setColor(embedColor)
				.setDescription(serverStatus)
				.addFields({ name: 'Server version:', value: res.version.name })
				.setThumbnail(`https://api.mcsrvstat.us/icon/${ip}:${port}`);
			interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
		});
	}
};
