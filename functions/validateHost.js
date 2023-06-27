'use strict';
import unidecode from 'unidecode';
import validator from 'validator';
const { isIP, isFQDN, isEmpty, isPort } = validator;

export function validateHost(host) {
	let [ip, port] = host.split(':');

	if (host.includes(':')) {
		return validateAddress(ip) && !isEmpty(port) && isPort(port);
	}

	return validateAddress(ip);
}

function validateAddress(ip) {
	const decoded = unidecode(ip);
	return (
		isIP(decoded) ||
		isFQDN(decoded, {
			allow_underscores: true,
			allow_numeric_tld: true
		})
	);
}
