const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendMessage } = require('../functions/sendMessage');
const { isMissingPermissions } = require('../functions/botPermissions');
const { findServer, findDefaultServer } = require('../functions/findServer');
const { noMonitoredServers, isNotMonitored, isNicknameUsed } = require('../functions/inputValidation');
const { logWarning } = require('../functions/consoleLogging');

const data = new SlashCommandBuilder()
	.setName('nickname')
	.setDescription('Change the nickname of a monitored Minecraft server')
	.addStringOption((option) => option.setName('nickname').setDescription('Server nickname').setRequired(true))
	.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.setDMPermission(false);

async function execute(interaction) {
	if (await noMonitoredServers(interaction.guildId, interaction)) return;
	if (await isNicknameUsed(interaction.options.getString('nickname'), interaction.guildId, interaction)) return;

	let server;

	// Find the server to rename
	if (interaction.options.getString('server')) {
		server = await findServer(interaction.options.getString('server'), ['ip', 'nickname'], interaction.guildId);
		if (await isNotMonitored(server, interaction)) return;
	} else {
		server = await findDefaultServer(interaction.guildId);
	}

	if (await isMissingPermissions('category', interaction.guild.channels.cache.get(server.categoryId), interaction)) return;

	// Rename the server category
	try {
		let channel = await interaction.guild.channels.cache.get(server.categoryId);
		await channel?.setName(interaction.options.getString('nickname'));
	} catch (error) {
		if (error.name.includes('RateLimitError')) {
			await sendMessage(interaction, 'The rate limit for this channel has been reached, please try renaming this server in a few minutes!');
		} else {
			logWarning('Error renaming channel while setting nickname', {
				'Channel ID': server.categoryId,
				'Guild ID': interaction.guildId,
				Error: error
			});
			await sendMessage(interaction, 'There was an error while renaming the channel!');
		}
		return;
	}

	await sendMessage(interaction, 'The server has successfully been renamed.');
}

module.exports = { data, execute };
