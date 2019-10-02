//let prefix = settings.commandPrefix;

exports.run = async (client, settings, message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(settings.commandPrefix)) {

        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);

        let commandfile = client.commands.get(cmd.slice(settings.commandPrefix.length));
        if(!commandfile) return;
        commandfile.run(client,message,args);
    }

};
