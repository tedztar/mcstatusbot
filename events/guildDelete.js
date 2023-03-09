const { Events } = require('discord.js');

const name = Events.GuildDelete;
const once = false;

async function execute(guild) {
	await serverDB.delete(guild.id);
}

module.exports = { name, once, execute };
