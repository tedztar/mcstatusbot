'use strict';
import { Events } from 'discord.js';
import { beaver } from '../functions/consoleLogging.js';
import { interactionQueue } from '../bot.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.deferred) throw new Error('Interaction was not deferred');
	} catch (error) {
		const commandOptions = getCommandOptions(interaction);

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

	await interactionQueue.add('interaction', {
		command,
		interaction
	});
}

export function getCommandOptions(interaction) {
	let commandOptions = [];

	interaction.options.data.forEach((option) => {
		let filteredOption = {};
		for (const key of ['name', 'value']) {
			if (option[key]) filteredOption[key] = option[key];
		}
		commandOptions.push(filteredOption);
	});

	return commandOptions.length ? commandOptions : null;
}
