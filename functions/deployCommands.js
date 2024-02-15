'use strict';
import 'dotenv/config';
import path from 'node:path';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { beaver } from './consoleLogging.js';
import { pathToFileURL } from 'node:url';

export async function deployCommands() {
	const commands = [];
	const commandsPath = path.resolve(process.cwd(), './commands');
	const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.resolve(commandsPath, file);
		const command = await import(pathToFileURL(filePath).toString());
		commands.push(command.data.toJSON());
	}

	const rest = new REST().setToken(process.env.TOKEN);

	try {
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
	} catch (error) {
		beaver.log('deploy-commands', error);
	}
}
