const Discord = require("discord.js");
const express = require('express');
const fs = require('fs');
const Keyv = require('keyv');

client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
embedColor = "#7289DA";

// Heroku
express().listen(5000, () => console.log(`Heroku deployed to localhost:5000`));

// Database
serverDB = new Keyv();
serverDB.on('error', err => console.error('Keyv connection error:', err));

// Command Handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('app/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`app/commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Event Handler
const eventFiles = fs.readdirSync('app/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`app/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(process.env.TOKEN);