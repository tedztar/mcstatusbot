'use strict';
import 'dotenv/config';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import { ActivityType, Client, Collection, GatewayIntentBits } from 'discord.js';
import mongoose from 'mongoose';
import { readdirSync } from 'node:fs';
import path, { basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { beaver } from './functions/consoleLogging.js';
import { Worker } from 'node:worker_threads';
import { updateServers } from './functions/updateServers.js';

let clientOptions = {
	shards: getInfo().SHARD_LIST,
	shardCount: getInfo().TOTAL_SHARDS,
	intents: [GatewayIntentBits.Guilds],
	presence: { activities: [{ name: '/help', type: ActivityType.Watching }] }
};

if (process.env.NODE_ENV == 'production') {
	clientOptions.rest = { api: `${process.env.PROXY_URL}/api`, globalRequestsPerSecond: Infinity, timeout: 5 * 60 * 1000, retries: 1 };
}

export let client = new Client(clientOptions);

client.cluster = new ClusterClient(client);

let clientReady = false;
let clusterReady = false;

client.cluster.once('ready', async () => {
	clusterReady = true;
	if (clientReady) init();
});

client.once('ready', async () => {
	clientReady = true;
	if (clusterReady) init();
});

client.on('error', (msg) => beaver.log('client', msg));

// Spawn a worker for updating servers
const updateServerWorker = process.env.USE_WORKERS == 'true' ? new Worker(pathToFileURL(path.resolve(process.cwd(), './workers/updateServerWorker.js'))) : null;

// Finally, login
client.login(process.env.TOKEN);

async function init() {
	// Database Handler
	mongoose.set('strictQuery', true);

	try {
		await mongoose.connect(process.env.DATABASE_URL, { dbName: process.env.DATABASE_NAME });
	} catch (error) {
		beaver.log('database', error);
		return;
	}

	// Command Handler
	client.commands = new Collection();
	const commandsPath = path.resolve(process.cwd(), './commands');
	const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.resolve(commandsPath, file);
		const command = await import(pathToFileURL(filePath).toString());
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			beaver.log('command-registration', `Error registering /${basename(file, '.js')} command: missing a required "data" or "execute" property.`);
		}
	}

	// Event Handler
	const eventsPath = path.resolve(process.cwd(), './events');
	const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
	for (const file of eventFiles) {
		const filePath = path.resolve(eventsPath, file);
		const event = await import(pathToFileURL(filePath).toString());
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	// MIGRATION TO WORKER
	if (process.env.USE_WORKERS == 'true') {
		// Update Servers
		if (process.env.NODE_ENV != 'production') updateServerWorker.postMessage('update');
		// Delay the update based on cluster id
		setTimeout(() => setInterval(() => updateServerWorker.postMessage('update'), 6 * 60 * 1000), client.cluster.id * 15 * 1000);
	} else {
		// Update Servers
		if (process.env.NODE_ENV != 'production') await updateServers(client);
		// Delay the update based on cluster id
		setTimeout(() => setInterval(updateServers, 6 * 60 * 1000, client), client.cluster.id * 15 * 1000);
	}
}
