module.exports = {
	name: 'guildDelete',
	once: false,
	async execute(guild) {
		await serverDB.delete(guild.id);
	}
};
