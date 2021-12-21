const { SlashCommandBuilder } = require('@discordjs/builders');
const mcping = require('mcping-js');
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Displays the current status and active players for your server')
        .addStringOption(option =>
            option
                .setName('ip')
                .setDescription('IP Address')
                .setRequired(false)
        ),
    async execute(interaction) {
        ipFull = interaction.options.getString('ip') ? interaction.options.getString('ip') : mcServer.get(interaction.guildId)[0].ip;
        ip = ipFull.split(":")[0];
        port = ipFull.split(":")[1] ? ipFull.split(":")[1] : 25565;
        const server = new mcping.MinecraftServer(ip, port);
        server.ping(10000, 47, async function (err, res) {
            if (err) {
                console.log(err);
                const responseEmbed = new Discord.MessageEmbed()
                    .setDescription('Error getting server status')
                    .setColor(embedColor)
                await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
                return;
            }
            else {
                if (typeof res.players.sample == 'undefined') {
                    serverStatus = '*No one is playing!*';
                }
                else {
                    let onlinePlayers = [];
                    for (var i = 0; i < res.players.sample.length; i++) {
                        onlinePlayers.push(res.players.sample[i].name);
                    };
                    onlinePlayers = onlinePlayers.sort().join(', ').replace(/\u00A7[0-9A-FK-OR]|\\n/ig, '');
                    serverStatus = '**' + res.players.online + '/' + res.players.max + '**' + ' player(s) online.\n\n' + onlinePlayers;
                };
                const responseEmbed = new Discord.MessageEmbed()
                    .setTitle('Status for ' + ip + ':')
                    .setColor(embedColor)
                    .setDescription(serverStatus)
                    .addField("Server version:", res.version.name)
                    .setThumbnail(`https://api.mcsrvstat.us/icon/${ip}:${port}`)
                interaction.reply({ embeds: [responseEmbed], ephemeral: true });
            }
        });
    },
};