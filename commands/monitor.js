const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { sendMessage } = require('../functions/sendMessage');
const { renameChannels } = require('../functions/renameChannels');
const { getServerStatus } = require('../functions/getServerStatus');
const { isMissingPermissions } = require('../functions/botPermissions');
const { noMonitoredServers, isMonitored, isNicknameUsed } = require('../functions/inputValidation');
const { getMonitoredServers, setMonitoredServers } = require('../functions/databaseFunctions');
const { findDefaultServer } = require('../functions/findServer');

const data = new SlashCommandBuilder()
	.setName('monitor')
	.setDescription('Create 2 voice channels that display the status of a Minecraft server')
	.addStringOption((option) => option.setName('ip').setDescription('IP address').setRequired(true))
	.addStringOption((option) => option.setName('nickname').setDescription('Server nickname').setRequired(false))
	.addBooleanOption((option) => option.setName('default').setDescription('Set this server to be the default for all commands').setRequired(false))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.setDMPermission(false);

async function execute(interaction) {
	if (await isMissingPermissions('server', interaction.guildId, interaction)) return;
	if (await isMonitored(interaction.options.getString('ip'), interaction.guildId, interaction)) return;
	if (await isNicknameUsed(interaction.options.getString('nickname'), interaction.guildId, interaction)) return;

	// Unset the default server if the new server is to be the default
	if (interaction.options.getBoolean('default')) {
		let server = await findDefaultServer(interaction.guildId);
		server ? server.default = false : null;
	}

	// Create the server object
	let newServer = {
		ip: interaction.options.getString('ip'),
		nickname: interaction.options.getString('nickname') || null,
		default: await noMonitoredServers(interaction.guildId) ? true : interaction.options.getBoolean('default') || false
	};

	// Create the server category
	try {
		let category = await interaction.guild.channels.create({
			name: interaction.options.getString('nickname') || interaction.options.getString('ip'),
			type: ChannelType.GuildCategory,
			permissionOverwrites: [
				{
					id: interaction.guild.roles.botRoleFor(interaction.client.user),
					allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.ManageChannels]
				},
				{
					id: interaction.guild.roles.everyone,
					deny: [PermissionFlagsBits.Connect]
				}
			]
		});
		newServer.categoryId = category.id;
	} catch (error) {
		console.warn(
			`Error creating category channel
						Guild ID: ${interaction.guildId}`
		);
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
			newServer[voiceChannel.idType] = channel.id;
			await channel.setParent(newServer.categoryId);
		} catch (error) {
			try {
				for (const channelId of [categoryId, statusId, playersId]) {
					await interaction.guild.channels.cache.get(newServer[channelId])?.delete();
				}
			} catch (error) {
				console.warn(
					`Error deleting channel while aborting monitor command
								Guild ID: ${interaction.guildId}
								Server IP: ${newServer.ip}`
				);
				throw error;
			}
			console.warn(
				`Error creating voice channel
							Guild ID: ${interaction.guildId}`
			);
			await sendMessage(interaction, 'There was an error while creating the channels!');
			return;
		}
	}

	// Add the server to the database
	let monitoredServers = await getMonitoredServers(interaction.guildId);
	await monitoredServers.push(newServer);
	await setMonitoredServers(interaction.guildId, monitoredServers);

	// Get the server status and update the channels
	const serverStatus = await getServerStatus(newServer.ip, 30 * 1000);
	const channels = [
		{ object: await interaction.client.channels.cache.get(newServer.statusId), name: 'statusName' },
		{ object: await interaction.client.channels.cache.get(newServer.playersId), name: 'playersName' }
	];
	await renameChannels(channels, serverStatus);

	console.log(`${newServer.ip} was monitored for guild ${interaction.guildId}`);

	await sendMessage(interaction,
		`The server has successfully been monitored${interaction.options.getBoolean('default') ? ' and set as the default server.' : '.'}`
	);
}

module.exports = { data, execute };
