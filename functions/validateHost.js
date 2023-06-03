const validator = require('validator');

function validateHost(host) {
	let [ip, port] = host.split(':');

	if (host.includes(':')) {
		return (validator.isIP(ip) || validator.isFQDN(ip)) && (!validator.isEmpty(port) || validator.isPort(port));
	}

	return validator.isIP(ip) || validator.isFQDN(ip);
}

module.exports = { validateHost };
