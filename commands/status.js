const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { embedColor, sendMessage } = require('../functions/sendMessage');
const { getServerStatus } = require('../functions/getServerStatus');
const { findServer, findDefaultServer } = require('../functions/findServer');
const { noMonitoredServers } = require('../functions/inputValidation');
const { logWarning } = require('../functions/consoleLogging');

const data = new SlashCommandBuilder()
	.setName('status')
	.setDescription('Displays the current status and active players for any server')
	.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false));

async function execute(interaction) {
	let serverIp;

	if (interaction.options.getString('server')) {
		let server = await findServer(interaction.options.getString('server'), ['nickname'], interaction.guildId);
		serverIp = server ? server.ip : interaction.options.getString('server');
	} else {
		if (await noMonitoredServers(interaction.guildId, interaction, true)) return;
		let server = await findDefaultServer(interaction.guildId);
		serverIp = server.ip;
	}

	//Get the server status
	let serverStatus;
	try {
		serverStatus = await getServerStatus(serverIp, 5 * 1000);
	} catch (error) {
		logWarning('Error pinging Minecraft server while running status command', {
			'Guild ID': interaction.guildId,
			'Server IP': serverIp,
			Error: error
		});
		await sendMessage(interaction, 'This IP address could not be pinged!');
		return;
	}

	// Message if server is offline
	if (!serverStatus.isOnline) {
		await sendMessage(interaction, `*The server is offline!*`, `Status for ${serverIp}:`);
		return;
	}

	// Message if server is online
	if (!serverStatus.players.sample) {
		message = `*No one is playing!*`;
	} else {
		let onlinePlayers = [];
		for (var i = 0; i < serverStatus.players.sample.length; i++) {
			onlinePlayers.push(serverStatus.players.sample[i].name);
		}
		onlinePlayers = onlinePlayers
			.sort()
			.join(', ')
			.replace(/\u00A7[0-9A-FK-OR]|\\n/gi, '');
		message = `**${serverStatus.players.online || 0}/${serverStatus.players.max}** player(s) online.\n\n${onlinePlayers}`;
	}

	const responseEmbed = new EmbedBuilder()
		.setTitle(`Status for ${serverIp}:`)
		.setColor(embedColor)
		.setDescription(message)
		.addFields({ name: 'Server version:', value: serverStatus.version.name })
		.setThumbnail(`https://api.mcsrvstat.us/icon/${serverIp}`);

	await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
}

module.exports = { data, execute };
