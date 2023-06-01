const { sendMessage } = require('./sendMessage');

const requiredPermissions = [
	{ flag: 'ViewChannel', category: 'View Channels', channel: 'View Channel', server: 'View Channels' },
	{ flag: 'ManageChannels', category: 'Manage Channels', channel: 'Manage Channel', server: 'Manage Channels' },
	{ flag: 'ManageRoles', category: 'Manage Permissions', channel: 'Manage Permissions', server: 'Manage Roles' },
	{ flag: 'Connect', category: 'Connect', channel: 'Connect', server: 'Connect' }
];

async function isMissingPermissions(type, object, interaction) {
	if (!object) return false;

	const missingPermissions = getMissingPermissions(type, object);
	if (missingPermissions) {
		interaction &&
			(await sendMessage(
				interaction,
				`The bot needs the following permissions in the ${type.toLowerCase()} to use this command:

            ${missingPermissions}`
			));
		return true;
	}

	return false;
}

function getMissingPermissions(type, object) {
	type = type.toLowerCase();
	basicType = type == 'status channel' || type == 'players channel' ? 'channel' : type;

	const botPermissions = getBotPermissions(type, object);
	let missingPermissions = [];

	for (const permission of requiredPermissions) {
		if (!botPermissions[permission.flag]) missingPermissions.push(permission[basicType]);
	}

	const missingPermissionsList = missingPermissions.join(', ');
	return missingPermissions.length ? missingPermissionsList : null;
}

function getBotPermissions(type, object) {
	let botPermissions = type == 'server' ? object.members.me.permissions.serialize() : object.guild.members.me.permissionsIn(object.id).serialize();
	let requiredPermissionsFlags = requiredPermissions.map((permission) => {
		return permission['flag'];
	});

	let filteredBotPermissions = Object.keys(botPermissions)
		.filter((permission) => requiredPermissionsFlags.includes(permission))
		.reduce((obj, key) => {
			obj[key] = botPermissions[key];
			return obj;
		}, {});

	return filteredBotPermissions;
}

module.exports = { isMissingPermissions, getMissingPermissions };
