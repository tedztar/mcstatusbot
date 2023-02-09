const Discord = require('discord.js');

module.exports = {
	name: 'channelUpdate',
	once: false,
	async execute(_, newChannel, client) {
		// Check if the bot has the manage roles permission
		if (!newChannel.guild.roles.botRoleFor(client.user)?.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) return;

		// Check if the updated channel is in the list of monitored channels
		const monitoredServers = (await serverDB.get(newChannel.guildId)) || [];
		let serverIndex = await monitoredServers.findIndex((server) => newChannel.id == server.categoryId);
		if (serverIndex == -1) return;

		// Check if the channel name is the same as the nickname listed in the database
		let server = monitoredServers[serverIndex];
		if (newChannel.name == server.nickname || newChannel.name == server.ip) return;

		// Set the nickname listed in the database to the channel name
		server.nickname = newChannel.name;
		await serverDB.set(newChannel.guildId, monitoredServers);
	}
};
