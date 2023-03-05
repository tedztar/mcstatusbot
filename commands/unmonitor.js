const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmonitor')
		.setDescription('Unmonitor the specified server or all servers')
		.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false)),
	async execute(interaction) {
		// Check if member has administrator permission
		if (!interaction.memberPermissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
			await sendMessage.newBasicMessage(interaction, 'You must have the administrator permission to use this command!');
			return;
		}

        if (!interaction.guild.roles.botRoleFor(interaction.client.user).permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) {
			await sendMessage.newBasicMessage(interaction, 'This bot needs the "manage roles" permission in order to rename channels!');
			return;
        }

		// Check if there are any servers to unmonitor
		const monitoredServers = (await serverDB.get(interaction.guildId)) || [];
		if (!monitoredServers.length) {
			await sendMessage.newBasicMessage(interaction, 'There are no servers to unmonitor!');
			return;
		}

		// Check if there are multiple servers to unmonitor and none were specified
		if (!interaction.options.getString('server') && monitoredServers.length > 1) {
			await sendMessage.newBasicMessage(interaction, 'Please specify a server to unmonitor!');
			return;
		}

		// Unmonitor all servers if specified
		if (interaction.options.getString('server') == 'all') {
			for (const server of monitoredServers) {
				try {
					await removeServer(interaction.guild, server);
				} catch (error) {
					await sendMessage.newBasicMessage(interaction, 'There was an error while deleting the channels. You might have to delete them manually!');
					return;
				}
			}

            console.log(`All servers were unmonitored for guild ${interaction.guildId}`);
            
			await sendMessage.newBasicMessage(interaction, 'The channels have successfully been removed.');
			return;
		}

		let server;

		// Find the server to unmonitor
		if (interaction.options.getString('server')) {
			let serverIndex = await monitoredServers.findIndex((server) => server.nickname == interaction.options.getString('server'));
			serverIndex == -1 ? (serverIndex = await monitoredServers.findIndex((server) => server.ip == interaction.options.getString('server'))) : null;
			server = serverIndex != -1 ? monitoredServers[serverIndex] : null;

			// Check if the server is being monitored
			if (!server) {
				await sendMessage.newBasicMessage(interaction, 'The server you have specified was not already being monitored!');
				return;
			}
		} else {
			// Find the default server if no server was specified
			let defaultServerIndex = await monitoredServers.findIndex((server) => server.default);
			server = defaultServerIndex != -1 ? monitoredServers[defaultServerIndex] : monitoredServers[0];
		}

		// Check if the server being unmonitored is the default server for all commands
		if (server.default && monitoredServers.length > 1) {
			await sendMessage.newBasicMessage(
				interaction,
				'You have more than one server monitored, and the server you are trying to unmonitor is the default server. Please set a new default first!'
			);
			return;
		}

		// Unmonitor the server
		try {
			await removeServer(interaction.guild, server);
		} catch (error) {
			await sendMessage.newBasicMessage(interaction, 'There was an error while deleting the channels. You might have to delete them manually!');
			return;
		}

        console.log(`${server.ip} was unmonitored for guild ${interaction.guildId}`);

		await sendMessage.newBasicMessage(interaction, 'The channels have been removed successfully.');
	}
};

async function removeServer(guild, server) {
        // Remove server from database
		let monitoredServers = (await serverDB.get(guild.id)) || [];
		serverIndex = await monitoredServers.indexOf(server);
		await monitoredServers.splice(serverIndex, 1);
		await serverDB.set(guild.id, monitoredServers);
        
		// Remove channels and server category
		const channels = [
			await guild.channels.cache.get(server.statusId),
			await guild.channels.cache.get(server.playersId),
			await guild.channels.cache.get(server.categoryId)
		];
        for (const channel of channels) {
            try {
                await channel.delete();
            } catch(error) {
                console.warn(
                    `Error deleting channel while removing server from guild
                        Channel ID: ${channel.id}
                        Guild ID: ${guild.id}
                        Server IP: ${server.ip}`
                );
                throw error;
            }
        }
}
