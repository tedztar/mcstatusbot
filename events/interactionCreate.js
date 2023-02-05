module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = await client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.log(error.code);

			try {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true
				});
			} catch (err) {
				console.log(`${err.code} occured while replying. Trying to edit existing reply`);

				await interaction
					.editReply({
						content: 'There was an error while executing this command!',
						ephemeral: true
					})
					.catch((e) => console.log(e.code));
			}
		}
	}
};
