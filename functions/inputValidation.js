const { getMonitoredServers } = require("./databaseFunctions");
const { findServer } = require("./findServer");

const reservedNames = ['all'];

module.exports = {
    async noMonitoredServers(guildId, interaction, isStatusCommand) {
        const monitoredServers = await getMonitoredServers(guildId);
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
    },
    async isDefault(server, interaction) {
        if (server.default) {
            interaction ? await sendMessage(interaction, 'This server is already the default server!') : null;
            return true;
        }
        else {
            return false;
        }
    },
    async isMonitored(ip, guildId, interaction) {
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
    },
    async isNotMonitored(server, interaction) {
        if (!server) {
            interaction ? await sendMessage(interaction, 'This server is not being monitored!') : null;
            return true;
        }
        else {
            return false;
        }
    },
    async isNicknameUsed(nickname, guildId, interaction) {
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
    },
    async isServerUnspecified(server, guildId, interaction) {
        if (await multipleMonitoredServers(guildId) && !server) {
            interaction ? await sendMessage(interaction, 'There are multiple monitored servers, and no server was specified!') : null;
            return true;
        }
        else {
            return false;
        }
    },
    async removingDefaultServer(server, guildId, interaction) {
        if (await multipleMonitoredServers(guildId) && await this.isDefault(server)) {
            interaction ? await sendMessage(interaction, 'There are multiple monitored servers, and this server is the default server!') : null;
            return true;
        }
        else {
            return false;
        }
    },
}

async function multipleMonitoredServers(guildId) {
    const monitoredServers = await getMonitoredServers(guildId);
    if (monitoredServers.length > 1) {
        return true;
    }
    else {
        return false;
    }
}