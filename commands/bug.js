'use strict';
import { SlashCommandBuilder } from 'discord.js';
import { sendMessage } from '../functions/sendMessage.js';

export const data = new SlashCommandBuilder().setName('bug').setDescription('Send a bug report to maintainers');

export async function execute(interaction) {
	await sendMessage(interaction, 'Report a bug by opening an issue in our [GitHub repository](https://github.com/RahulR100/mcstatusbot/issues).');
}
