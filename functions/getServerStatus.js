const mcping = require('mcping-js');
const unidecode = require('unidecode');
const { validateHost } = require('./validateHost');

function getServerStatus(serverIp, timeout) {
	if (!validateHost(serverIp)) {
		return { isOnline: false };
	}

	let [ip, port] = serverIp.split(':');

	const mcserver = new mcping.MinecraftServer(unidecode(ip), parseInt(port) || 25565);

	return new Promise((resolve) => {
		mcserver.ping(timeout, 47, (error, response) => {
			resolve({ ...response, isOnline: !error, error: error });
		});
	});
}

module.exports = { getServerStatus };
