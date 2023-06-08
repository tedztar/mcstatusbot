import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendMessage } from '../functions/sendMessage.js';
import { isMissingPermissions, getMissingPermissions } from '../functions/botPermissions.js';
import { findServer, findDefaultServer, findServerIndex } from '../functions/findServer.js';
import { getKey, setKey } from '../functions/databaseFunctions.js';
import { noMonitoredServers, isServerUnspecified, removingDefaultServer, isNotMonitored } from '../functions/inputValidation.js';
import { logWarning } from '../functions/consoleLogging.js';

export const data = new SlashCommandBuilder()
	.setName('unmonitor')
	.setDescription('Unmonitor the specified server or all servers')
	.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.setDMPermission(false);

export async function execute(interaction) {
	if (await noMonitoredServers(interaction.guildId, interaction)) return;
	if (await isServerUnspecified(interaction.options.getString('server'), interaction.guildId, interaction)) return;

	// Unmonitor all servers if specified
	if (interaction.options.getString('server') == 'all') {
		let notUnmonitored = [];
		let notDeleted = [];
		let monitoredServers = await getKey(interaction.guild.id);
		await Promise.allSettled(
			monitoredServers.map(async (server) => {
				// Check if the bot has the required permissions'
				let missingPermissions = false;
				const channels = [
					{ id: server.categoryId, type: 'Category' },
					{ id: server.statusId, type: 'Status Channel' },
					{ id: server.playersId, type: 'Players Channel' }
				];
				await Promise.all(
					channels.map(async (channel) => {
						if (await isMissingPermissions(channel.type, interaction.guild.channels.cache.get(channel.id))) {
							let missingPermissions = getMissingPermissions(channel.type, interaction.guild.channels.cache.get(channel.id));
							notUnmonitored.push({
								name: server.nickname || server.ip,
								type: channel.type,
								missingPermissions
							});
							throw new Error();
						}
					})
				).catch(() => (missingPermissions = true));
				if (missingPermissions) return;

				try {
					await removeServer(server, interaction.guild);
				} catch (error) {
					notDeleted.push(server.nickname || server.ip);
				}
			})
		);

		if (!notUnmonitored.length && !notDeleted.length) {
			await sendMessage(interaction, 'The channels have successfully been removed.');
		} else {
			let notUnmonitoredList = notUnmonitored
				.map((server) => {
					return `${server.name} // ${server.type}: ${server.missingPermissions}`;
				})
				.join('\n');
			let notDeletedList = notDeleted.join(', ');
			await sendMessage(
				interaction,
				`There was an error while unmonitoring some of the servers!
				${
					notUnmonitored.length
						? `
				The following servers need the required category and/or channel permissions before you can unmonitor them:\n
				${notUnmonitoredList}`
						: ''
				} ${
					notDeleted.length
						? `
				The following servers were unmonitored, but the channels need to be removed manually:\n
				${notDeletedList}`
						: ''
				}`
			);
		}
		return;
	}

	let server;

	if (interaction.options.getString('server')) {
		server = await findServer(interaction.options.getString('server'), ['ip', 'nickname'], interaction.guildId);
		if (await isNotMonitored(server, interaction)) return;
	} else {
		server = await findDefaultServer(interaction.guildId);
	}

	if (await removingDefaultServer(server, interaction.guildId, interaction)) return;

	// Check if the bot has the required permissions
	let missingPermissions = false;
	const channels = [
		{ id: server.categoryId, type: 'Category' },
		{ id: server.statusId, type: 'Status Channel' },
		{ id: server.playersId, type: 'Players Channel' }
	];
	await Promise.all(
		channels.map(async (channel) => {
			if (await isMissingPermissions(channel.type, interaction.guild.channels.cache.get(channel.id), interaction)) throw new Error();
		})
	).catch(() => (missingPermissions = true));
	if (missingPermissions) return;

	// Unmonitor the server
	try {
		await removeServer(server, interaction.guild);
	} catch (error) {
		await sendMessage(interaction, 'There was an error while deleting some of the channels. Please delete them manually!');
		return;
	}

	await sendMessage(interaction, 'The server has successfully been unmonitored.');
}

async function removeServer(server, guild) {
	// Remove server from database
	let monitoredServers = await getKey(guild.id);
	let serverIndex = await findServerIndex(server, guild.id);
	monitoredServers.splice(serverIndex, 1);
	await setKey(guild.id, monitoredServers);

	// Remove channels and server category
	const channels = [
		await guild.channels.cache.get(server.statusId),
		await guild.channels.cache.get(server.playersId),
		await guild.channels.cache.get(server.categoryId)
	];

	await Promise.allSettled(
		channels.map(async (channel) => {
			try {
				await channel?.delete();
			} catch (error) {
				logWarning('Error deleting channel while removing server from guild', {
					'Channel ID': channel.id,
					'Guild ID': guild.id,
					'Server IP': server.ip,
					Error: error
				});
				throw error;
			}
		})
	).then((promises) => {
		promises.forEach((promise) => {
			if (promise.status == 'rejected') throw new Error();
		});
	});
}
