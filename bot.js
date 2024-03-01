'use strict';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import { ActivityType, Client, Collection, GatewayIntentBits } from 'discord.js';
import mongoose from 'mongoose';
import { readdirSync } from 'node:fs';
import path, { basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { beaver } from './functions/consoleLogging.js';
import { updateServerHandler, updateServers } from './functions/updateServers.js';
import IORedis from 'ioredis';
import { Queue, Worker } from 'bullmq';

let clientOptions = {
	shards: getInfo().SHARD_LIST,
	shardCount: getInfo().TOTAL_SHARDS,
	intents: [GatewayIntentBits.Guilds],
	presence: { activities: [{ name: '/help', type: ActivityType.Watching }] }
};

if (process.env.NODE_ENV == 'production') {
	clientOptions.rest = { api: `${process.env.PROXY_URL}/api`, globalRequestsPerSecond: Infinity, timeout: 5 * 60 * 1000, retries: 1 };
}

let client = new Client(clientOptions);

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

// Connect to redis
const redis = new IORedis(process.env.REDIS_URL, {
	maxRetriesPerRequest: null,
	connectTimeout: 30000
}).on('error', (msg) => beaver.log('redis', msg));

// Set up queue for server status updates
const QUEUE_NAME = `updateServer${client.cluster.id}`;
const QUEUE_PREFIX = '/mcs/updateServer/${client.cluster.id}/';

export const queue = new Queue(QUEUE_NAME, {
	connection: redis,
	prefix: QUEUE_PREFIX,
	defaultJobOptions: {
		removeOnComplete: true,
		removeOnFail: true
	}
});
queue.on('error', (msg) => beaver.log('queue', msg));

// Set up worker for server status updates
const worker = new Worker(QUEUE_NAME, path.resolve(process.cwd(), './functions/updateServerWorker.js'), {
	connection: redis,
	autorun: false,
	prefix: QUEUE_PREFIX
});
worker.on('error', (msg) => beaver.log('worker', msg));

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

	// Run the worker
	worker.run();

	// Update Servers
	if (process.env.NODE_ENV != 'production') await updateServers(client);
	// Delay the update based on cluster id
	setTimeout(() => setInterval(updateServers, 6 * 60 * 1000, client), client.cluster.id * 30 * 1000);
}
