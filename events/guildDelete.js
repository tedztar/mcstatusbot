const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildDelete,
	once: false,
	async execute(guild) {
		await serverDB.delete(guild.id);
	}
};
