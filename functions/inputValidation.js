const { getKey } = require("./databaseFunctions");
const { findServer, findDefaultServer } = require("./findServer");
const { sendMessage } = require("./sendMessage");

const reservedNames = ['all'];

async function noMonitoredServers(guildId, interaction, isStatusCommand) {
    const monitoredServers = await getKey('guildData', guildId);
    if (!monitoredServers.length) {
        interaction ? await sendMessage(
            interaction,
            `There are no monitored servers${isStatusCommand ? ', and no IP address was specified!' : '!'}`
        ) : null;
        return true;
    }
    else {
        return false;
    }
}

async function isDefault(server, guildId, interaction) {
    let defaultServer = await findDefaultServer(guildId);
    if (JSON.stringify(server) == JSON.stringify(defaultServer)) {
        interaction ? await sendMessage(interaction, 'This server is already the default server!') : null;
        return true;
    }
    else {
        return false;
    }
}

async function isMonitored(ip, guildId, interaction) {
    let server = await findServer(ip, ['ip'], guildId);
    if (server) {
        interaction ? await sendMessage(interaction, 'This IP address is already being monitored!') : null;
        return true;
    }
    server = await findServer(ip, ['nickname'], guildId);
    if (server) {
        interaction ? await sendMessage(interaction, 'This IP address is the nickname of another server that is already being monitored!') : null;
        return true;
    }
    if (reservedNames.includes(ip)) {
        interaction ? await sendMessage(interaction, 'This IP address is a restricted keyword!') : null;
        return true;
    }
    else {
        return false;
    }
}

async function isNotMonitored(server, interaction) {
    if (!server) {
        interaction ? await sendMessage(interaction, 'This server is not being monitored!') : null;
        return true;
    }
    else {
        return false;
    }
}

async function isNicknameUsed(nickname, guildId, interaction) {
    let server = await findServer(nickname, ['nickname'], guildId);
    if (nickname && server) {
        interaction ? await sendMessage(interaction, 'This nickname is already being used!') : null;
        return true;
    }
    server = await findServer(nickname, ['ip'], guildId);
    if (nickname && server) {
        interaction ? await sendMessage(interaction, 'This nickname is the IP address of another server that is already being monitored!') : null;
        return true;
    }
    if (reservedNames.includes(nickname)) {
        interaction ? await sendMessage(interaction, 'This nickname is a restricted keyword!') : null;
        return true;
    }
    else {
        return false;
    }
}

async function isServerUnspecified(server, guildId, interaction) {
    if (await multipleMonitoredServers(guildId) && !server) {
        interaction ? await sendMessage(interaction, 'There are multiple monitored servers, and no server was specified!') : null;
        return true;
    }
    else {
        return false;
    }
}

async function removingDefaultServer(server, guildId, interaction) {
    if (await multipleMonitoredServers(guildId) && await isDefault(server, guildId)) {
        interaction ? await sendMessage(interaction, 'There are multiple monitored servers, and this server is the default server!') : null;
        return true;
    }
    else {
        return false;
    }
}

async function multipleMonitoredServers(guildId) {
    const monitoredServers = await getKey('guildData', guildId);
    if (monitoredServers.length > 1) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = { noMonitoredServers, isDefault, isMonitored, isNotMonitored, isNicknameUsed, isServerUnspecified, removingDefaultServer };
