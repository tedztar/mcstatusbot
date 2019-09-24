const Discord = require("discord.js")
const mcping = require('mc-ping-updated')
const chalk = require('chalk')
const escape = require('markdown-escape')

const client = new Discord.Client()
const settings = require('./config.json');
var hasIcon = 'n/a'
pingFrequency = (settings.pingInterval * 1000)
embedColor = ("0x" + settings.embedColor)

function getDate() {
    date = new Date();
    cleanDate = date.toLocaleTimeString();
}

function getServerStatus() {
    mcping(settings.ip, settings.port, function(err, res) {
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

//Startup:
client.on("ready", () => {
    console.log("Ready!");
    getServerStatus()
    client.setInterval(getServerStatus, pingFrequency);
});

//Command Handling
client.on('message', message => {
    if (!message.content.startsWith(settings.commandPrefix)) return;
    if (message.author.bot) return; {
        const args = message.content.slice(settings.commandPrefix.length).trim().split(
            / +/g);
        const command = args.shift().toLowerCase();
        console.log('Command \'' + message.content + '\' issued by ' + message.member.user.tag);



        //Help command handling
        if (command === "help" || command === "commands" || command === "list" | command ===
            "bot") {

            console.log('Issuing help message.');
            const helpEmbed = new Discord.RichEmbed()
                            .setTitle('Commands:')
                            .setColor(embedColor)
                            .setDescription('**/status** - The current status and player count of your server \n**/crash** - Restart the bot')
                        message.channel.send(helpEmbed);
            return;

            
        }
        //Status command handling
        else if (command === "status" || command === "server" || command === "online") {
            mcping(settings.ip, settings.port, function(err, res) {
                if (err) {
                    console.log(err);
                    message.channel.send('Error getting server status.');
                    return;
                } else {
                    console.log('RES:', res)
                    //console.log('players:', res.players)
                    //console.log('sample:', res.players.sample)
                    
                    //console.log('DESC:', res.description)
                    //console.log('EXTRA:', res.description.extra)
                    try {
                        favicon = res.favicon.slice(22)
                        hasIcon = 'yes'
                    } catch (error) {
                        hasIcon = 'no'
                    }
                    let onlinePlayers = [];
                    if (typeof res.players.sample == 'undefined') {
                        serverStatus = '*No one is playing!*';
                    } else {
                        for (var i = 0; i < res.players.sample.length; i++) {
                            onlinePlayers.push(res.players.sample[i].name);
                        };
                        onlinePlayers = escape(onlinePlayers.sort().join(', ')).replace(/\u00A7[0-9A-FK-OR]|\\n/ig,'');
                        serverStatus = '**' + res.players.online + '/' + res.players.max +
                            '**' + ' player(s) online.\n\n' + onlinePlayers;
                        
                        console.log('Server Status', serverStatus);
                    };
                    if (hasIcon === 'yes') {
                        const buffer = Buffer.from(favicon, 'base64')
                        const serverEmbedicon = new Discord.RichEmbed().attachFile({ attachment: buffer,
                            name: 'icon.png' }).setTitle('Status for ' +
                            settings.ip + ':').setColor(embedColor).setDescription(
                            serverStatus).setThumbnail('attachment://icon.png').addField(
                            "Server version:", res.version.name)
                        message.channel.send(serverEmbedicon);
                    } else if (hasIcon === 'no') {
                        const serverEmbedNoIcon = new Discord.RichEmbed().setTitle(
                                'Status for ' + settings.ip + ':').setColor(embedColor)
                            .setDescription(serverStatus).addField("Server version:",
                                res.version.name)
                        message.channel.send(serverEmbedNoIcon);
                    }
                }
            }, 3000);
            return;
        } else if (command === "crash") {client.user.setActivity("Reloading...");
    process.exit(1);} else return;
    }
})
client.login(settings.token);

