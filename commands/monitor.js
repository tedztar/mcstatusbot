const { SlashCommandBuilder } = require('@discordjs/builders');
const updateChannels = require('../functions/updateChannels')

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
		if (!interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			interaction.reply('You must have the administrator permission to use this command!');
			return;
		}

		// Create category
		let serverCategory;
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
		}).then(channel => { serverCategory = channel })

		// Crate channels and add to category
		let statusChannel;
		await interaction.guild.channels.create('Updating status. . .', {
			type: 'GUILD_VOICE'
		}).then(async function (channel) {
			await channel.setParent(categoryId);
			statusId = channel.id;
		})

		let playersChannel;
		await interaction.guild.channels.create('Updating players . . .', {
			type: 'GUILD_VOICE'
		}).then(async function (channel) {
			await channel.setParent(categoryId);
			playersChannel = channel;
		})

		// Add the Minecraft server to the list of monitored servers
		const newServer = {
			ip: interaction.options.getString('ip'),
			categoryId: serverCategory.id,
			statusId: statusChannel.id,
			playersId: playersChannel.id
		}
		monitoredServers = mcServers.get(interaction.guildId).push(newServer);
		mcServers.set(interaction.guildId, monitoredServers);

		const responseEmbed = new Discord.MessageEmbed()
			.setDescription('The channels have been created successfully and are currently being updated.')
			.setColor(embedColor)
		await interaction.reply({ embeds: [responseEmbed], ephemeral: true });

		updateChannels.execute(server);
	}
};