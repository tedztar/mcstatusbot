const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const updateChannels = require('../functions/updateChannels');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('monitor')
		.setDescription('Create 2 voice channels that display the status of a Minecraft server')
		.addStringOption((option) => option.setName('ip').setDescription('IP address').setRequired(true))
		.addStringOption((option) => option.setName('nickname').setDescription('Server nickname').setRequired(false))
		.addBooleanOption((option) => option.setName('default').setDescription('Set this server to be the default for all commands').setRequired(false)),
	async execute(interaction) {
		// Check if the member has the administrator permission
		if (!interaction.memberPermissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
			await sendMessage.newBasicMessage(interaction, 'You must have the administrator permission to use this command!');
			return;
		}

		// Check if the bot has the manage roles permission
		if (!interaction.guild.roles.botRoleFor(interaction.client.user).permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) {
			await sendMessage.newBasicMessage(interaction, 'This bot needs the "manage roles" permission in order to create channels!');
			return;
		}

		// Check if the nickname of IP is a reserved keyword
		if (reservedNames.includes(interaction.options.getString('ip')) || reservedNames.includes(interaction.options.getString('nickname'))) {
			await sendMessage.newBasicMessage(interaction, 'You tried to give the server a restricted name, please try a different name!');
			return;
		}

		// Check if the server is already being monitored
		let monitoredServers = (await serverDB.get(interaction.guildId)) || [];
		let serverIndex = await monitoredServers.findIndex((server) => server.ip == interaction.options.getString('ip'));
		if (serverIndex != -1) {
			await sendMessage.newBasicMessage(interaction, 'This server is already being monitored!');
			return;
		}

		// Check if the nickname is already being used
		nicknameIndex = await monitoredServers.findIndex((server) => server.nickname == interaction.options.getString('nickname'));
		if (interaction.options.getString('nickname') && nicknameIndex != -1) {
			await sendMessage.newBasicMessage(interaction, 'This nickname is already being used!');
			return;
		}

		// Unset the default server if the new server is to be the default for all commands
		if (interaction.options.getBoolean('default') && monitoredServers.length) {
			let defaultServerIndex = await monitoredServers.findIndex((server) => server.default);

			if (defaultServerIndex != -1) {
				let oldDefaultServer = monitoredServers[defaultServerIndex];
				oldDefaultServer.default = false;
			}
		}

		// Create the server object
		let newServer = {
			ip: interaction.options.getString('ip'),
			nickname: interaction.options.getString('nickname') || null,
			default: interaction.options.getBoolean('default') || false
		};

		// Make the server the default if it's the only one in the guild
		!monitoredServers.length ? newServer.default = true : null;

		// Create the server category
		await interaction.guild.channels
			.create({
				name: interaction.options.getString('nickname') || interaction.options.getString('ip'),
				type: Discord.ChannelType.GuildCategory,
				permissionOverwrites: [
					{
						id: interaction.guild.roles.botRoleFor(interaction.client.user),
						allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.ManageChannels, Discord.PermissionsBitField.Flags.Connect]
					},
					{
						id: interaction.guild.roles.everyone,
						deny: [Discord.PermissionsBitField.Flags.Connect]
					}
				]
			})
			.then((channel) => {
				newServer.categoryId = channel.id;
			})
            .catch((error) => {
                console.warn(
                    `Error creating category channel
                        Guild ID: ${interaction.guildId}`
                );

		// Create the channels and add to category
        let voiceChannels = [
            {type: 'statusId', name:'Status: Updating...'},
            {type: 'playersId', name: 'Players: Updating...'}
        ];
        voiceChannels.forEach(async (voiceChannel) => {
            await interaction.guild.channels
			.create({
				name: voiceChannel.name,
				type: Discord.ChannelType.GuildVoice
			})
			.then(async (channel) => {
				await channel.setParent(newServer.categoryId);
				newServer[voiceChannel.type] = channel.id;
            })
            .catch(async (error) => {
                await interaction.guild.channels.cache.get(newServer.categoryId).delete()
                .catch((error) => {
                    console.warn(
                        `Error deleting category channel while aborting monitor command
                            Channel ID: ${newServer.categoryId}
                            Guild ID: ${interaction.guildId}
                            Server IP: ${newServer.ip}`
                    )
                    throw error;
                })
                console.warn(
                    `Error creating voice channel
                        Guild ID: ${interaction.guildId}`
                );
            };
        }

		await monitoredServers.push(newServer);
		await serverDB.set(interaction.guildId, monitoredServers);

		await updateChannels.execute(newServer);

        console.log(`${newServer.ip} was monitored for guild ${interaction.guildId}`);

		await sendMessage.newBasicMessage(interaction,
			`The server has successfully been monitored${interaction.options.getBoolean('default') ? ' and set as the default server.' : '.'}`
		);
	}
};
