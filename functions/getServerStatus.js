const mcping = require('node-mcstatus');
const unidecode = require('unidecode');
const { validateHost } = require('./validateHost');

function getServerStatus(serverIp) {
	if (!validateHost(serverIp)) {
		return { isOnline: false };
	}

	let [ip, port] = serverIp.split(':');

	return new Promise((resolve) => {
		mcping
		.statusJava(unidecode(ip), parseInt(port) || 25565)
		.then((response) => {
			resolve({ ...response, icon: null });
		})
		.catch((error) => {
			resolve({ isOnline: false, error: error });
		});
	});
}

module.exports = { getServerStatus };
