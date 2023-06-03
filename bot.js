const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { ClusterClient, getInfo } = require('discord-hybrid-sharding');
const fs = require('node:fs');
const path = require('node:path');
const { database } = require('./functions/databaseFunctions');
const { updateServers } = require('./functions/updateServers');
const { logError, logSuccess } = require('./functions/consoleLogging');

const client = new Client({
	shards: getInfo().SHARD_LIST,
	shardCount: getInfo().TOTAL_SHARDS,
	intents: [GatewayIntentBits.Guilds],
	presence: { activities: [{ name: '/help', type: ActivityType.Watching }] },
	rest: { rejectOnRateLimit: ['/channels'] }
});
client.cluster = new ClusterClient(client);

let clientReady = false;
let clusterReady = false;

client.cluster.once('ready', () => {
	clusterReady = true;
	if (clientReady) init();
});

client.once('ready', async () => {
	clientReady = true;
	if (clusterReady) init();
});

client.login(process.env.TOKEN);

async function init() {
	// Database Handler
	database.on('error', (error) => logError('Keyv connection error:', error));

	// Command Handler
	client.commands = new Collection();
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			logError(`Error registering /${path.basename(file, '.js')} command: missing a required "data" or "execute" property.`);
		}
	}

	// Event Handler
	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	// Update Servers
	await updateServers(client);
	setInterval(updateServers, 6 * 60 * 1000, client);
}
