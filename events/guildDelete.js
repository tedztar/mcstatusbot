module.exports = {
	name: 'guildDelete',
	once: false,
	async execute(guild) {
		serverDB.delete(guild.id);
	}
};
