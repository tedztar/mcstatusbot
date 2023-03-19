const Keyv = require('keyv');

const guildData = process.env.DATABASE_URL ?
    new Keyv(`${process.env.DATABASE_URL}?sslmode=no-verify`, { namespace: 'guildData' }) :
    new Keyv({ namespace: 'guildData' });

const applicationData = process.env.DATABASE_URL ?
    new Keyv(`${process.env.DATABASE_URL}?sslmode=no-verify`, { namespace: 'applicationData' }) :
    new Keyv({ namespace: 'applicationData' });

const database = {
    guildData,
    applicationData
}

async function getKey(namespace, key) {
    return await database[namespace].get(key) || [];
}

async function setKey(namespace, key, value) {
    await database[namespace].set(key, value);
    return;
}

async function deleteKey(namespace, key) {
    await database[namespace].delete(key);
    return;
}

module.exports = { database, getKey, setKey, deleteKey };