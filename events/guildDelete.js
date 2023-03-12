const { Events } = require('discord.js');
const { deleteFromDatabase } = require('../functions/databaseFunctions');

const name = Events.GuildDelete;
const once = false;

async function execute(guild) {
	await deleteFromDatabase(guild.id);
}

module.exports = { name, once, execute };
