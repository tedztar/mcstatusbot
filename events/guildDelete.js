'use strict';
import { Events } from 'discord.js';
import { deleteGuild } from '../functions/databaseFunctions.js';

export const name = Events.GuildDelete;
export const once = false;

export async function execute(guild) {
	await deleteGuild(guild.id);
}
