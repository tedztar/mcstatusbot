'use strict';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { logError } from './consoleLogging.js';

export async function deployCommands() {
	const commands = [];
	const commandsPath = join(__dirname, '..', 'commands');
	const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
	}

	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

	try {
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
	} catch (error) {
		logError(error);
	}
}
