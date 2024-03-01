import { getCommandOptions } from '../events/interactionCreate';
import { beaver } from '../functions/consoleLogging';

export default async (job) => {
	const command = job.data.command;
	const interaction = job.data.interaction;

	try {
		await command.execute(interaction);
	} catch (error) {
		const commandOptions = getCommandOptions(interaction);

		beaver.log(
			'interaction-create',
			'Error executing command',
			JSON.stringify({
				'Guild ID': interaction.guildId,
				'Command Name': interaction.commandName,
				'Command Options': commandOptions || 'None'
			}),
			error
		);

		await interaction.editReply({
			content:
				'There was an error while executing this command! Please try again in a few minutes. If the problem persists, please open an issue on GitHub.',
			ephemeral: true
		});
	}

	return true;
};
