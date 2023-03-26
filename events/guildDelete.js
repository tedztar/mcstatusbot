const { Events } = require('discord.js');
const { deleteKey } = require('../functions/databaseFunctions');

const name = Events.GuildDelete;
const once = false;

async function execute(guild) {
	await deleteKey(guild.id);
}

module.exports = { name, once, execute };
