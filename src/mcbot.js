const Discord = require("discord.js");
const mcping = require('mc-ping-updated');
const chalk = require('chalk');
//const escape = require('markdown-escape');
//const fs = require('fs');
const http = require('http');
const url = require("url");
const { promisify } = require("util");

const client = new Discord.Client();
const settings = require('../config.json');
const readdir = promisify(require("fs").readdir);

var hasIcon = 'n/a';
var ready = false;
const apiURL = "https://api.mcsrvstat.us/2/<address>";

const ip = process.env.ip || settings.ip;
const port = parseInt(process.env.port || settings.port); //need to parse int as mcping requires int for the port value
const token = process.env.token || settings.token;
const pingInterval = process.env.pingInterval || settings.pingInterval;
const embedColorConfig = process.env.embedColor || settings.embedColor;

const webPort = process.env.PORT || 3000;

pingFrequency = (pingInterval * 1000);
embedColor = ("0x" + embedColorConfig);

function getDate() {
    const date = new Date();
    const cleanDate = date.toLocaleTimeString();
    return cleanDate;
}

function getServerStatus() {
    mcping(ip, port, function(err, res) {
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
    load()
    client.setInterval(getServerStatus, pingFrequency);
});
client.login(token);

//Heroku Compatibility 
http.createServer(function (req, res) {
    if (!ready) {
        res.send("Bot still getting ready");
        res.end();
    } else {
        res.writeHead(301, {Location: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`});
        res.end();
    }
    
}).listen(webPort);