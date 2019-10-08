const Discord = require("discord.js");
const mcping = require('mc-ping-updated');
const chalk = require('chalk');
const escape = require('markdown-escape');
const fs = require('fs');
var http = require('http');

const client = new Discord.Client();
const settings = require('./config.json');
var hasIcon = 'n/a';

const ip = process.env.ip || settings.ip;
const port = process.env.port || settings.port;
const token = process.env.token || settings.token;
const pingInterval = process.env.pingInterval || settings.pingInterval;
const embedColorConfig = process.env.embedColor || settings.embedColor;

const webPort = process.env.PORT || 3000;

pingFrequency = (pingInterval * 1000);
embedColor = ("0x" + embedColorConfig);

function getDate() {
    date = new Date();
    cleanDate = date.toLocaleTimeString();
}

function getServerStatus() {
    mcping(ip, port, function(err, res) {
        if (!(typeof err === 'undefined' || err === null)) {
            client.user.setStatus('dnd');
            serverStatus = 'Server offline';
            client.user.setActivity(serverStatus, { type: 'PLAYING' });
            getDate()
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
    })
}

//Command Handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) return console.log(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        console.log("Successfully loaded " + file)
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
    });
});
//Events "handler"
fs.readdir('./events/', (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        let eventFunc = require(`./events/${file}`);
        console.log("Successfully loaded " + file);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunc.run(client, settings, ...args));
    });
});

//Startup:
client.on("ready", () => {
    console.log("Ready!");
    getServerStatus()
    client.setInterval(getServerStatus, pingFrequency);
});
client.login(token);

//Heroku Compatibility 
http.createServer(function (req, res) {
    res.write('Hello World!');
    res.end();
}).listen(webPort);