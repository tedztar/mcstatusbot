const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { sendMessage } = require('../functions/sendMessage');
const { renameChannels } = require('../functions/renameChannels');
const { getServerStatus } = require('../functions/getServerStatus');
const { isMissingPermissions } = require('../functions/botPermissions');
const { noMonitoredServers, isMonitored, isNicknameUsed, isValidServer } = require('../functions/inputValidation');
const { getKey, setKey } = require('../functions/databaseFunctions');
const { findDefaultServer, findServerIndex } = require('../functions/findServer');
const { logWarning } = require('../functions/consoleLogging');

const data = new SlashCommandBuilder()
	.setName('monitor')
	.setDescription('Create 2 voice channels that display the status of a Minecraft server')
	.addStringOption((option) => option.setName('ip').setDescription('IP address').setRequired(true))
	.addStringOption((option) => option.setName('nickname').setDescription('Server nickname').setRequired(false))
	.addBooleanOption((option) => option.setName('default').setDescription('Set this server to be the default for all commands').setRequired(false))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.setDMPermission(false);

async function execute(interaction) {
	if (await isMissingPermissions('server', interaction.guild, interaction)) return;
	if (await isMonitored(interaction.options.getString('ip'), interaction.guildId, interaction)) return;
	if (await isNicknameUsed(interaction.options.getString('nickname'), interaction.guildId, interaction)) return;
	if (!(await isValidServer(interaction.options.getString('ip'), interaction))) return;

	// Unset the default server if the new server is to be the default
	if (interaction.options.getBoolean('default')) {
		let server = await findDefaultServer(interaction.guildId);
		let serverIndex = await findServerIndex(server, interaction.guildId);
		let monitoredServers = await getKey(interaction.guildId);

		if (monitoredServers.length > 0 && serverIndex >= 0) {
			monitoredServers[serverIndex].default = false;
		}

		await setKey(interaction.guildId, monitoredServers);
	}

	// Create the server object
	let server = {
		ip: interaction.options.getString('ip'),
		nickname: interaction.options.getString('nickname') || null,
		default: (await noMonitoredServers(interaction.guildId)) ? true : interaction.options.getBoolean('default') || false
	};

	// Create the server category
	try {
		let category = await interaction.guild.channels.create({
			name: interaction.options.getString('nickname') || interaction.options.getString('ip'),
			type: ChannelType.GuildCategory,
			permissionOverwrites: [
				{
					id: interaction.guild.members.me,
					allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.ManageChannels]
				},
				{
					id: interaction.guild.roles.everyone,
					deny: [PermissionFlagsBits.Connect]
				}
			]
		});
		server.categoryId = category.id;
	} catch (error) {
		logWarning('Error creating category channel', {
			'Guild ID': interaction.guildId,
			Error: error
		});
		await sendMessage(interaction, 'There was an error while creating the channels!');
		return;
	}

	// Create the channels and add to category
	let voiceChannels = [
		{ idType: 'statusId', name: 'Status: Updating...' },
		{ idType: 'playersId', name: 'Players: Updating...' }
	];
	for (const voiceChannel of voiceChannels) {
		try {
			let channel = await interaction.guild.channels.create({
				name: voiceChannel.name,
				type: ChannelType.GuildVoice
			});
			server[voiceChannel.idType] = channel.id;
			await channel.setParent(server.categoryId);
		} catch (error) {
			const channelIds = ['categoryId', 'statusId', 'playersId'];
			await Promise.allSettled(
				channelIds.map(async (channelId) => {
					try {
						await interaction.guild.channels.cache.get(server[channelId])?.delete();
					} catch (error) {
						logWarning('Error deleting channel while aborting monitor command', {
							'Channel ID': server[channelId],
							'Guild ID': interaction.guildId,
							'Server IP': server.ip,
							Error: error
						});
					}
				})
			);
			logWarning('Error creating voice channel', {
				'Guild ID': interaction.guildId,
				Error: error
			});
			await sendMessage(interaction, 'There was an error while creating the channels, please manually delete any channels that were created!');
			return;
		}
	}

	// Add the server to the database
	let monitoredServers = await getKey(interaction.guildId);
	monitoredServers.push(server);
	await setKey(interaction.guildId, monitoredServers);

	await sendMessage(
		interaction,
		`The server has successfully been monitored${interaction.options.getBoolean('default') ? ' and set as the default server.' : '.'}`
	);

	// Get the server status and update the channels
	const serverStatus = await getServerStatus(server.ip, 5 * 1000);
	const channels = [
		{ object: await interaction.guild.channels.cache.get(server.statusId), name: 'statusName' },
		{ object: await interaction.guild.channels.cache.get(server.playersId), name: 'playersName' }
	];
	await renameChannels(channels, serverStatus);
}

module.exports = { data, execute };
