const Discord = require("discord.js");

exports.run = async (settings, client, message, args) => {
	//code to run when command is sent
	console.log('Issuing help message.');
             const helpEmbed = new Discord.RichEmbed()
                             .setTitle('Commands:')
                             .setColor(embedColor)
                             .setDescription('**/status** - The current status and player count of your server \n**/crash** - Restart the bot')
                         message.channel.send(helpEmbed);
             return;
}
