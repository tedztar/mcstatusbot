import { isIP, isFQDN, isEmpty, isPort } from 'validator';

export function validateHost(host) {
	let [ip, port] = host.split(':');

	if (host.includes(':')) {
		return (isIP(ip) || isFQDN(ip)) && (!isEmpty(port) || isPort(port));
	}

	return isIP(ip) || isFQDN(ip);
}
