//let prefix = settings.commandPrefix;

module.exports = async (client, settings, message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(process.env.commandPrefix || settings.commandPrefix)) {

        let messageArray = message.content.split(" ");
		let cmd = messageArray[0];
		cmd = cmd.shift().toLowerCase();
        let args = messageArray.slice(1);

        let commandfile = client.commands.get(cmd.slice(process.env.commandPrefix || settings.commandPrefix));
		if (!commandfile) {
			console.log(message.member.user.tag + "  tried to run command: " + cmd + ". However Command does not exist!");
			return;
		}
		console.log(message.member.user.tag + " ran command: " + cmd);
		commandfile.run(client, message, args);
    }

};