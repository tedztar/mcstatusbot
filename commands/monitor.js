const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const updateChannels = require('../functions/updateChannels');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('monitor')
		.setDescription('Create a channel category and 2 voice channels that display the status of a Minecraft server')
		.addStringOption(option =>
			option
				.setName('ip')
				.setDescription('IP address')
				.setRequired(true)
		),
	async execute(interaction) {
		// Check if the member has the administrator permission
		if (!interaction.memberPermissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
			const responseEmbed = new Discord.MessageEmbed()
				.setDescription('You must have the administrator permission to use this command!')
				.setColor(embedColor)
			await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
			return;
		}

		let newServer = {
			ip: interaction.options.getString('ip')
		};

		// Create the server category
		await interaction.guild.channels.create(interaction.options.getString('ip'), {
			type: 'GUILD_CATEGORY',
			permissionOverwrites: [
				{
					id: interaction.guild.me.roles.botRole,
					allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT']
				},
				{
					id: interaction.guild.roles.everyone,
					deny: ['CONNECT']
				}
			]
		}).then(channel => { newServer.categoryId = channel.id });

		// Crate channels and add to category
		await interaction.guild.channels.create('Status: Updating...', {
			type: 'GUILD_VOICE'
		}).then(async function (channel) {
			await channel.setParent(newServer.categoryId);
			newServer.statusId = channel.id;
		});

		await interaction.guild.channels.create('Players: Updating...', {
			type: 'GUILD_VOICE'
		}).then(async function (channel) {
			await channel.setParent(newServer.categoryId);
			newServer.playersId = channel.id;
		});

		let monitoredServers = await serverDB.get(interaction.guildId) ? await serverDB.get(interaction.guildId) : [];
		monitoredServers.push(newServer);
		await serverDB.set(interaction.guildId, monitoredServers);

		updateChannels.execute(newServer);

		const responseEmbed = new Discord.MessageEmbed()
			.setDescription('The channels have been created successfully and are currently being updated.')
			.setColor(embedColor)
		await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
	}
};