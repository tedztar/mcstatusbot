const Discord = require("discord.js");
const express = require('express');
const fs = require('fs');
const Keyv = require('keyv');

// Heroku
express().listen(5000, () => console.log(`Listening on port 5000`));

// Global Variables
var client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS] });
var embedColor = "#7289DA";

// Database
var server = new Keyv(process.env.DATABASE_URL, {namespace: 'server'} );
server.on('error', err => console.error('Keyv connection error:', err));

// Command Handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Event Handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(process.env.TOKEN);