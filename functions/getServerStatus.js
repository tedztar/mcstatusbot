const mcping = require('mcping-js');
const unidecode = require('unidecode');

function getServerStatus(serverIp, timeout) {
	let [ip, port] = serverIp.split(':');

	const mcserver = new mcping.MinecraftServer(unidecode(ip), parseInt(port || 25565));

	return new Promise((resolve) => {
		mcserver.ping(timeout, 47, (error, response) => {
			let results = Object.assign({ isOnline: !error }, response);
			resolve(results);
		});
	});
}

module.exports = { getServerStatus };
