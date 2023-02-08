module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = await client.commands.get(interaction.commandName);

		if (!command) return;

		await interaction
			.deferReply({ ephemeral: true })
			.then(async () => {
				try {
					await command.execute(interaction);
				} catch (error) {
					console.log(error);

					await interaction.editReply({
						content: 'There was an error while executing this command!',
						ephemeral: true
					});
				}
			})
			.catch(async (error) => {
				console.log(error);
				console.log('Could not defer reply!');
			});
	}
};
