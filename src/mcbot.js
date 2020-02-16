//require('dotenv').config(); 
// Create a .env file or include your own config file
// USED FOR TESTING ONLY COMMENT WHEN DONE TESTING

const Discord = require("discord.js");
const mcping = require('mc-ping-updated');
const chalk = require('chalk');
const ping = require("web-pingjs");
//const escape = require('markdown-escape');
//const fs = require('fs');
const { promisify } = require("util");

//Webserver app
const express = require('express');
const app = express();

const client = new Discord.Client();
const settings = require('../config.js');
const readdir = promisify(require("fs").readdir);

var hasIcon = 'n/a';
var ready = false;

/*
const ip = process.env.ip || settings.ip;
const port = parseInt(process.env.port || settings.port); //need to parse int as mcping requires int for the port value
const token = process.env.token || settings.token;
const pingInterval = process.env.pingInterval || settings.pingInterval;
const embedColorConfig = process.env.embedColor || settings.embedColor;
const webPort = process.env.PORT || 3000;
*/

webServerPing = (20 * 60000) // Set to every 20 min multiply minutes by 60000 to get milliseconds
pingFrequency = (settings.pingInterval * 1000);
embedColor = ("0x" + settings.embedColor);

function getDate() {
    const date = new Date();
    const cleanDate = date.toLocaleTimeString();
    return cleanDate;
}

function getServerStatus() {
    mcping(settings.ip, settings.port, function(err, res) {
        const cleanDate = getDate();
        if (!(typeof err === 'undefined' || err === null)) {
            client.user.setStatus('dnd');
            serverStatus = 'Server offline';
            client.user.setActivity(serverStatus, { type: 'PLAYING' });
            console.log((chalk.yellow('\[' + cleanDate + '\]:') + chalk.white(' Ping: ' +
                'Error getting server status')));
            console.error(err);
            return;
        }
        if (typeof res.players.sample === 'undefined') { client.user.setStatus('idle') }
        if (!(typeof res.players.sample === 'undefined')) { client.user.setStatus('online') }
        serverStatus = res.players.online + ' / ' + res.players.max;
        getDate()
        client.user.setActivity(serverStatus, { type: 'PLAYING' }).then(presence => console.log(
            chalk.cyan('\[' + cleanDate + '\]:') + chalk.white(' Ping: ' + serverStatus)
        )).catch(console.error);
    });
}

function serverPing () {
    const cleanDate = getDate();
    ping('localhost:' + settings.webPort).then(function(delta) {
        console.log(chalk.blue('\[' + cleanDate + '\]:') + chalk.white(' Pinged Webserver: ' + String(delta)));
        //console.log('Ping time was ' + String(delta) + ' ms');
    }).catch(function(err) {
        console.error(chalk.red('\[' + cleanDate + '\]:') + chalk.white(err));
        //console.error('Could not ping remote URL', err);
    });
}

//Command Handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

//Loads the commands and events
async function load () {

	const cmds = await readdir("./src/commands/");
	const events = await readdir("./src/events/");
    
    //Command loader
	await cmds.forEach(file => {

		try {
			if (!file.endsWith(".js")) return;
			
			let props = require(`./commands/${file}`);
			
			let commandName = file.split(".")[0];
			
			client.commands.set(commandName, props);
			//console.log(`Loaded command: \"${commandName}\"`);

			delete require.cache[require.resolve(`./commands/${file}`)];
		} catch (e) {
			console.error(e);
		}

	});
    
    //Event loader
	await events.forEach(file => {
		if (file.split(".").slice(-1)[0] !== "js") return;

		const event = require(`./events/${file}`);
		const eventName = file.split(".")[0];

		client.on(eventName, (...args) => event(client, settings, ...args)); //event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
}

//Startup
client.on("ready", () => {
    ready = true;
    console.log("Ready!");
    getServerStatus()
    serverPing()

    load()
    client.setInterval(getServerStatus, pingFrequency);
    client.setInterval(serverPing, webServerPing);
});
client.login(settings.token);

//Heroku Compatibility
app.use(express.static('public')); // need for http://wakemydyno.com/
app.get('/', (req, res) => {
    //This is also the link used to ping the server
    res.send('To invite the bot go to <a href="/invite">here</a>');
});
app.get('/invite', (req, res) => {
    if (!ready) {
        res.send("Bot still getting ready");
        res.end();
    } else {
        res.writeHead(301, {Location: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`});
        res.end();
    }
});
app.listen(settings.webPort, () => {
    console.log(`Webserver bound to port ${settings.webPort}`);
});