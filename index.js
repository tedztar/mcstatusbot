require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const fs = require('fs');
const Keyv = require('keyv');

client = new Client({ intents: [GatewayIntentBits.Guilds] });
embedColor = '#7289DA';

// Server
express().listen(process.env.PORT || 5000);

// Database
serverDB = process.env.DATABASE_URL
	? new Keyv(`${process.env.DATABASE_URL}?sslmode=no-verify`)
	: new Keyv();
serverDB.on('error', (err) => console.error('Keyv connection error:', err));

// Command Handler
client.commands = new Collection();
const commandFiles = fs
	.readdirSync(`${__dirname}/commands`)
	.filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`${__dirname}/commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Event Handler
const eventFiles = fs
	.readdirSync(`${__dirname}/events`)
	.filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`${__dirname}/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(process.env.TOKEN);
