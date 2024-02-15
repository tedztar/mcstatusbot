'use strict';
import { Events } from 'discord.js';
import { beaver } from '../functions/consoleLogging.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	const commandOptions = getCommandOptions(interaction);

	if (!command) return;

	try {
		await interaction.deferReply({ ephemeral: true });
		if (!interaction.deferred) throw new Error('Interaction was not deferred');
	} catch (error) {
		beaver.log(
			'interaction-create',
			'Error deferring reply to command',
			JSON.stringify({
				'Guild ID': interaction.guildId,
				'Command Name': interaction.commandName,
				'Command Options': commandOptions || 'None'
			}),
			error
		);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
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
}

function getCommandOptions(interaction) {
	let commandOptions = [];
	for (const option of interaction.options.data) {
		const filteredData = ['name', 'value'];
		let filteredOption = Object.keys(option)
			.filter((data) => filteredData.includes(data))
			.reduce((obj, key) => {
				obj[key] = option[key];
				return obj;
			}, {});
		commandOptions.push(filteredOption);
	}
	return commandOptions.length ? commandOptions : null;
}
