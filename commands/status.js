const { SlashCommandBuilder } = require('@discordjs/builders');
const mcping = require('mcping-js');
const Discord = require("discord.js");
const settings = require('../config.json');

const server = new mcping.MinecraftServer(settings.ip, settings.port);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Displays the current status and active players for your server'),
    async execute(interaction) {
        server.ping(10000, settings.protocolversion, async function (err, res) {
            if (err) {
                console.log(err);
                const responseEmbed = new Discord.MessageEmbed()
                    .setDescription('Error getting server status')
                    .setColor(settings.embedcolor)
                await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
                return;
            } else {
                let hasIcon;
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
                    onlinePlayers = onlinePlayers.sort().join(', ').replace(/\u00A7[0-9A-FK-OR]|\\n/ig, '');
                    let maxPlayers;
                    if (settings.maxplayers == 'default') { maxPlayers = res.players.max }
                    else if (settings.maxplayers == 'memberCount') {
                        const guild = client.guilds.cache.get(settings.guildid);
                        const fetchedMembers = await guild.members.fetch();
                        maxPlayers = String(fetchedMembers.filter(member => !member.user.bot).size);
                    }
                    else { maxPlayers = settings.maxplayers }
                    serverStatus = '**' + res.players.online + '/' + maxPlayers + '**' + ' player(s) online.\n\n' + onlinePlayers;
                };
                if (hasIcon === 'yes') {
                    const buffer = Buffer.from(favicon, 'base64')
                    const serverEmbedIcon = new Discord.MessageEmbed().attachFile({
                        attachment: buffer,
                        name: 'icon.png'
                    }).setTitle('Status for ' +
                        settings.ip + ':').setColor(settings.embedcolor).setDescription(
                            serverStatus).setThumbnail('attachment://icon.png').addField(
                                "Server version:", res.version.name)
                    interaction.reply({ embeds: [serverEmbedIcon], ephemeral: true });
                } else if (hasIcon === 'no') {
                    const serverEmbedNoIcon = new Discord.MessageEmbed().setTitle(
                        'Status for ' + settings.ip + ':').setColor(settings.embedcolor)
                        .setDescription(serverStatus).addField("Server version:",
                            res.version.name)
                    interaction.reply({ embeds: [serverEmbedNoIcon], ephemeral: true });
                }
            }
        });
    },
};