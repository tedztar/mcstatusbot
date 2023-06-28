'use strict';
import { getServers } from './databaseFunctions.js';

export async function findServer(query, fields, guildId) {
	const monitoredServers = await getServers(guildId);
	let serverIndex = -1;
	let server;

	for (const field of fields) {
		serverIndex = monitoredServers.findIndex((server) => server[field] == query);
		if (serverIndex != -1) {
			server = monitoredServers[serverIndex];
			break;
		}
	}
	return server;
}

export async function findDefaultServer(guildId) {
	const monitoredServers = await getServers(guildId);
	const serverIndex = monitoredServers.findIndex((server) => server.default);
	const server = serverIndex != -1 ? monitoredServers[serverIndex] : monitoredServers[0];
	return server;
}

export async function findServerIndex(query, guildId) {
	const monitoredServers = await getServers(guildId);
	const serverIndex = monitoredServers.findIndex((server) => server.ip == query.ip);
	return serverIndex;
}
