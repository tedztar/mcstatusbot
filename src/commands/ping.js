const { MessageEmbed } = require("discord.js");
const ping = require("web-pingjs");

module.exports.run = async (client, message, settings, args) => {
    const Embed = new MessageEmbed();
    //console.log(settings.ip + ":" + settings.port);
    Embed.setTitle("Pong!");
    Embed.addField("Bot's ping:", `${client.ping} ms`, true);
    
    ping(settings.ip + ":" + settings.port).then((delta) => {
        //console.log(delta);
        Embed.addField("Server's ping:", `${String(delta)} ms`, true);
        //console.log('Ping time was ' + String(delta) + ' ms');
    }).catch(function(err) {
        console.error(err);
        Embed.addField("Server ping:", "Error, could not ping");
        //console.error('Could not ping remote URL', err);
    });

	Embed.setTimestamp();
    Embed.setColor(settings.embedColor);
    
	message.channel.send(Embed)
		.catch();
}