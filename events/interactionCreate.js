module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.log(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true
			});
		}
	}
};
