//let prefix = settings.commandPrefix;

module.exports = async (client, settings, message) => {
	if (message.author.bot) return;

	if (!message.content.startsWith(settings.commandPrefix)) return;
	
	const args = message.content.slice(settings.commandPrefix.length).trim().split(/ +/g); //.find(p => message.content.startsWith(p))
	const cmd = args.shift().toLowerCase();

	let command = client.commands.get(cmd);
	if (command) {
		console.log(message.author.tag + " ran command: " + cmd);
		command.run(client, message, settings, args);
	}

};
