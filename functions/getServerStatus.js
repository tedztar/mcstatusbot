'use strict';
import { statusBedrock, statusJava } from 'node-mcstatus';
import unidecode from 'unidecode';
import { validateHost } from './validateHost.js';

export async function getServerStatus(server) {
	if (!validateHost(server.ip)) {
		throw new Error('Invalid server IP');
	}

	let [ip, port] = server.ip.split(':');
	ip = unidecode(ip);
	port = parseInt(port) || undefined;

	let startTime = Date.now();
	let response = server.platform == 'bedrock' ? await statusBedrock(ip, port) : await statusJava(ip, port);
	let latency = Date.now() - startTime + ' ms';

	// Final check for valid response, incase our validation missed something
	if (typeof response != 'object') {
		throw new Error('Invalid server response');
	}

	// Use the clean name where possible
	if (response.online) {
		response.version.name = response.version.name_clean || response.version.name;
	}

	return { ...response, latency };
}
