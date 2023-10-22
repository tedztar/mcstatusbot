'use strict';
import { statusBedrock, statusJava } from 'node-mcstatus';
import unidecode from 'unidecode';
import { isValidServer } from './inputValidation.js';

export async function getServerStatus(server) {
	if (!isValidServer(server.ip)) {
		return { online: false };
	}

	let [ip, port] = server.ip.split(':');
	ip = unidecode(ip);
	port = parseInt(port) || undefined;

	try {
		let startTime = Date.now();
		let response = (server.platform == 'bedrock') ? await statusBedrock(ip, port) : await statusJava(ip, port);
		let latency = Date.now() - startTime + ' ms';
		response.version.name = response.version.name_clean || response.version.name;
		return { ...response, latency };
	} catch (error) {
		return { online: false, error: error };
	}
}
