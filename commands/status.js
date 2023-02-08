const { SlashCommandBuilder } = require('@discordjs/builders');
const mcping = require('mcping-js');
const Discord = require('discord.js');
const sendMessage = require('../functions/sendMessage');
const unidecode = require('unidecode');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Displays the current status and active players for any server')
		.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false)),
	async execute(interaction) {
		const monitoredServers = (await serverDB.get(interaction.guildId)) || [];

		let serverIp;

		// Find the server to retrieve the status
		if (interaction.options.getString('server')) {
			let serverIndex = await monitoredServers.findIndex((server) => server.nickname == interaction.options.getString('server'));
			serverIp = serverIndex == -1 ? interaction.options.getString('server') : monitoredServers[serverIndex].ip;
		} else {
			// Check if there is a default server to retrieve the status
			if (!monitoredServers.length) {
				await sendMessage.newBasicMessage(interaction, 'You must monitor a server or specify an IP address!');
				return;
			}

			// Find the default server if no server was specified
			let defaultServerIndex = await monitoredServers.findIndex((server) => server.default);
			serverIp = defaultServerIndex != -1 ? monitoredServers[defaultServerIndex].ip : monitoredServers[0].ip;
		}

		let [ip, port] = serverIp.split(':');
		ip = unidecode(ip);
		port = parseInt(port || 25565);

		const server = new mcping.MinecraftServer(ip, port);

		try {
			server.ping(30000, 47, async function (err, res) {
				if (err) {
					await sendMessage.newMessageWithTitle(interaction, `*The server is offline!*`, `Status for ${serverIp}:`);
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
					.setTitle(`Status for ${serverIp}:`)
					.setColor(embedColor)
					.setDescription(serverStatus)
					.addFields({ name: 'Server version:', value: res.version.name })
					.setThumbnail(`https://api.mcsrvstat.us/icon/${ip}:${port}`);

				await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
			});
		} catch (error) {
			console.log(`${error.code}: ${ip}:${port}`);
			await sendMessage.newBasicMessage(interaction, 'The IP address supplied was invalid');
			return;
		}
	}
};
