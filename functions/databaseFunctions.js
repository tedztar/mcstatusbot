const Keyv = require('keyv');

const database = process.env.DATABASE_URL ? new Keyv(`${process.env.DATABASE_URL}?sslmode=no-verify`) : new Keyv();

async function getKey(key) {
    return await database.get(key) || [];
}

async function setKey(key, value) {
    await database.set(key, value);
    return;
}

async function deleteKey(key) {
    await database.delete(key);
    return;
}

module.exports = { database, getKey, setKey, deleteKey };