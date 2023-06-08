import { Events } from 'discord.js';
import { deleteKey } from '../functions/databaseFunctions.js';

export const name = Events.GuildDelete;
export const once = false;

export async function execute(guild) {
	await deleteKey(guild.id);
}
