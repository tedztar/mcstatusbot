module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = await client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await interaction.deferReply({ ephemeral: true });
			await command.execute(interaction);
		} catch (error) {
			console.log(error.code);
			await interaction.editReply({
				content: 'There was an error while executing this command!',
				ephemeral: true
			});
		}
	}
};
