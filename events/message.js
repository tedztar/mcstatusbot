//let prefix = settings.commandPrefix;
exports.run = async (client, settings, message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(settings.commandPrefix)) {

        let messageArray = message.content.split(" ");
		let cmd = messageArray[0];
		cmd = cmd.toLowerCase();
        let args = messageArray.slice(1);

        let commandfile = client.commands.get(cmd.slice(settings.commandPrefix.length));
		if (!commandfile) {
            console.log(message.member.user.tag + "  tried to run command: " + cmd + ". However Command does not exist!");
            message.delete().catch(console.error);
			return;
		}
		console.log(message.member.user.tag + " ran command: " + cmd);
        commandfile.run(settings, client, message, args);
        message.delete().catch(console.error);
    }

};
