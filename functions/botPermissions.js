'use strict';
import { sendMessage } from './sendMessage.js';

const requiredPermissions = [
	{ flag: 'ViewChannel', category: 'View Channels', channel: 'View Channel', server: 'View Channels' },
	{ flag: 'ManageChannels', category: 'Manage Channels', channel: 'Manage Channel', server: 'Manage Channels' },
	{ flag: 'ManageRoles', category: 'Manage Permissions', channel: 'Manage Permissions', server: 'Manage Roles' },
	{ flag: 'Connect', category: 'Connect', channel: 'Connect', server: 'Connect' }
  ];
  
  export async function isMissingPermissions(type, object, interaction) {
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
  
  export function getMissingPermissions(type, object) {
	type = type.toLowerCase();
	const basicType = (type == 'status channel' || type == 'players channel') ? 'channel' : type;
  
	const botPermissions = (type == 'server') ? object.members.me.permissions.toArray() : object.guild.members.me.permissionsIn(object.id).toArray();
	const missingPermissions = requiredPermissions.filter((permission) => {
	  return !botPermissions.includes(permission.flag);
	})
	.map(permission => permission[basicType]);
  
	const missingPermissionsList = missingPermissions.join(', ');
	return missingPermissions.length ? missingPermissionsList : null;
  }
  