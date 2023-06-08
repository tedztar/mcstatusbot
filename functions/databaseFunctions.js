'use strict';
import Keyv from 'keyv';

export const database = process.env.DATABASE_URL ? new Keyv(process.env.DATABASE_URL) : new Keyv();

export async function getKey(key) {
	return (await database.get(key)) || [];
}

export async function setKey(key, value) {
	await database.set(key, value);
	return;
}

export async function deleteKey(key) {
	await database.delete(key);
	return;
}
