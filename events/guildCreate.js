const deployCommands = require('../functions/deployCommands')

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(guild) {
        deployCommands.execute(guild);
    }
}