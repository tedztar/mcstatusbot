const fs = require("fs");

module.exports.run = async (client, message, settings, args) => {
    //code to run when command is sent
    
    /*fs.readdir('./src/commands/', (err, file) => {
    });

    if (args[0]){
        const command = args[0];

        if (!client.commands.has(command)) {
        }
    } else {
        
    }*/

    const helpEmbed = new Discord.RichEmbed()
        .setTitle('Commands:')
        .setColor(embedColor)
        .setDescription('**/status** - The current status and player count of your server \n**/crash** - Restart the bot')
    message.channel.send(helpEmbed);
    return;
}