'use strict';
import { statusJava } from 'node-mcstatus';
import unidecode from 'unidecode';
import { validateHost } from './validateHost.js';

export async function getServerStatus(serverIp) {
	if (!validateHost(serverIp)) {
		return { isOnline: false };
	}

	let [ip, port] = serverIp.split(':');

	return statusJava(unidecode(ip), parseInt(port) || 25565)
		.then((response) => {
			return { ...response, icon: null };
		})
		.catch((error) => {
			return { isOnline: false, error: error };
		});
}
