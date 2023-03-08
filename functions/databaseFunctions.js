const Keyv = require('keyv');

const database = process.env.DATABASE_URL ? new Keyv(`${process.env.DATABASE_URL}?sslmode=no-verify`) : new Keyv();
database.on('error', (error) => console.error('Keyv connection error: ', error));

module.exports = {
    async getMonitoredServers(guildId) {
        return await database.get(guildId) || [];
    },
    async setMonitoredServers(guildId, monitoredServers) {
        await database.set(guildId, monitoredServers);
        return;
    }
}