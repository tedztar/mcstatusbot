const Keyv = require('keyv');

const database = process.env.DATABASE_URL ? new Keyv(`${process.env.DATABASE_URL}?sslmode=no-verify`) : new Keyv();

async function getMonitoredServers(guildId) {
    return await database.get(guildId) || [];
}

async function setMonitoredServers(guildId, monitoredServers) {
    await database.set(guildId, monitoredServers);
    return;
}

async function deleteFromDatabase(guildId) {
    await database.delete(guildId);
    return;
}

module.exports = { database, getMonitoredServers, setMonitoredServers, deleteFromDatabase };