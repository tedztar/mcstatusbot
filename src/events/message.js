//let prefix = settings.commandPrefix;

module.exports = async (client, settings, message) => {
	if (message.author.bot) return;
	
	const prefix = process.env.commandPrefix || settings.commandPrefix

	if (!message.content.startsWith(prefix)) return;
	
	const args = message.content.slice(prefix.length).trim().split(/ +/g); //.find(p => message.content.startsWith(p))
	const cmd = args.shift().toLowerCase();

	let command = client.commands.get(cmd);
	if (command) {
		console.log(message.member.user.tag + " ran command: " + cmd);
		command.run(client, message, args);
	}

};
