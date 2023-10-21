'use strict';
import { getServers } from './databaseFunctions.js';

export async function findServer(query, fields, guildId) {
	const monitoredServers = await getServers(guildId);
	let serverIndex = -1;
	let matchingServer;

	for (const field of fields) {
		serverIndex = monitoredServers.findIndex((server) => {
			return server[field]?.toLowerCase() == query?.toLowerCase();
		});
		if (serverIndex != -1) {
			matchingServer = monitoredServers[serverIndex];
			break;
		}
	}
	return matchingServer;
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
