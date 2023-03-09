const requiredPermissions = [
    'ViewChannel',
    'ManageChannels',
    'ManageRoles',
    'Connect'
];

async function isMissingPermissions(type, id, interaction) {
    const missingPermissions = getMissingPermissions(type, id);
    if (missingPermissions) {
        interaction ? await sendMessage(
            interaction,
            `This bot needs the following ${type} permissions to use this command: ${missingPermissionsList}`
        ) : null;
        return true;
    }
    else {
        return false;
    }
}

function getMissingPermissions(type, id) {
    const botPermissions = getBotPermissions(type, id);
    let missingPermissions = [];
    for (const permission of requiredPermissions) {
        if (!botPermissions[permission]) missingPermissions.push(permission);
    }
    const missingPermissionsList = missingPermissions.join(', ').split(/(?=[A-Z])/).join(' ');
    return missingPermissionsList;
}

function getBotPermissions(type, id) {
    let botPermissions = [];
    if (type == 'channel') {
        botPermissions = id.guild.members.me.permissionsIn(id).serialize();
    }
    else if (type == 'server') {
        botPermissions = id.members.me.permissions.serialize();
    }
    else {
        console.warn(`Error getting permissions: type is not a channel or guild`);
        return;
    }
    let filteredBotPermissions = Object.keys(botPermissions)
        .filter(permission => requiredPermissions.includes(permission))
        .reduce((obj, key) => {
            obj[key] = botPermissions[key];
            return obj;
        }, {});
    return filteredBotPermissions;
}

module.exports = { isMissingPermissions, getMissingPermissions };