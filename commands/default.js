'use strict';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { getServers, setServers } from '../functions/databaseFunctions.js';
import { findDefaultServer, findServer, findServerIndex } from '../functions/findServer.js';
import { isDefault, isNotMonitored, noMonitoredServers } from '../functions/inputValidation.js';
import { sendMessage } from '../functions/sendMessage.js';

export const data = new SlashCommandBuilder()
	.setName('default')
	.setDescription('Set a server to be the default for all commands')
	.addStringOption((option) => option
		.setName('server')
		.setDescription('Server IP address or nickname')
		.setRequired(false))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.setDMPermission(false);

export async function execute(interaction) {
	if (await noMonitoredServers(interaction.guildId, interaction)) return;

	// List the default server if no server is specified
	let oldDefaultServer = await findDefaultServer(interaction.guildId);
	if (!interaction.options.getString('server')) {
		await sendMessage(interaction, oldDefaultServer.nickname || oldDefaultServer.ip, 'Default Server:');
		return;
	}

	let newDefaultServer = await findServer(interaction.options.getString('server'), ['ip', 'nickname'], interaction.guildId);
	if (await isNotMonitored(newDefaultServer, interaction)) return;
	if (await isDefault(newDefaultServer, interaction.guildId, interaction)) return;

	let monitoredServers = await getServers(interaction.guildId);
	const oldDefaultServerIndex = await findServerIndex(oldDefaultServer, interaction.guildId);
	const newDefaultServerIndex = await findServerIndex(newDefaultServer, interaction.guildId);
	monitoredServers[oldDefaultServerIndex].default = false;
	monitoredServers[newDefaultServerIndex].default = true;
	await setServers(interaction.guildId, monitoredServers);

	await sendMessage(interaction, 'The server has successfully been made the default for all commands.');
}
