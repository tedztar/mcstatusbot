'use strict';
import { Events } from 'discord.js';
import { logWarning } from '../functions/consoleLogging.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await interaction.deferReply({ ephemeral: true });
	} catch (error) {
		let commandOptions = getCommandOptions(interaction);

		logWarning('Error deferring reply to command', {
			'Guild ID': interaction.guildId,
			'Command Name': interaction.commandName,
			'Command Options': commandOptions || 'None',
			Error: error
		});
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		let commandOptions = getCommandOptions(interaction);

		logWarning('Error executing command', {
			'Guild ID': interaction.guildId,
			'Command Name': interaction.commandName,
			'Command Options': commandOptions || 'None',
			Error: error
		});

		await interaction.editReply({
			content: 'There was an error while executing this command!',
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
