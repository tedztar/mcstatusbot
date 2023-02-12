module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = await client.commands.get(interaction.commandName);

		if (!command) return;

		await interaction.deferReply({ ephemeral: true })
			.then(async () => {
				try {
					await command.execute(interaction);
				} catch (error) {
                    let commandOptions = [];
                    await interaction.options.data.forEach((option) => {
                        const filteredData = ['name', 'value'];
                        Object.keys(option)
                        .filter(data => option.includes(data))
                        .reduce((obj, key) => {
                            obj[key] = option[key];
                            commandOptions.push(obj);
                        }, {});
                    });
                    console.warn(
                        `Error executing command
                            Guild ID: ${interaction.guildId}
                            Command: /${interaction.commandName}
                            Command Options: ${commandOptions}`
                    );

					await interaction.editReply({
						content: 'There was an error while executing this command!',
						ephemeral: true
					});
				}
			})
			.catch(async (error) => {
                console.warn(
                    `Error deferring reply to command
                        Guild ID: ${interaction.guildId}
                        Command: /${interaction.commandName}`
                );

				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true
				});
			});
	}
};
