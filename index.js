require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { database } = require('./functions/databaseFunctions');

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
	rest: { rejectOnRateLimit: ['/channels'] }
});

express().listen(process.env.PORT || 5000);

// Database Handler
database.on('error', (error) => console.error('Keyv connection error: ', error));

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
		console.warn(`Error registering /${path.basename(file, '.js')} command: missing a required "data" or "execute" property.`);
	}
}

// Event Handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);
