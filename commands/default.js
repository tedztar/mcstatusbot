const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getMonitoredServers, setMonitoredServers } = require('../functions/databaseFunctions');
const { findServer, findDefaultServer } = require('../functions/findServer');
const { noMonitoredServers, isDefault, isNotMonitored } = require('../functions/inputValidation');
const { sendMessage } = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('default')
		.setDescription('Set a server to be the default for all commands')
		.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDMPermission(false),
	async execute(interaction) {
		if (await noMonitoredServers(interaction.guildId, interaction)) return;

		// List the default server if no server is specified
		let oldDefaultServer = await findDefaultServer(interaction.guildId);
		if (!interaction.options.getString('server')) {
			await sendMessage(interaction, oldDefaultServer.nickname || oldDefaultServer.ip, 'Default Server:');
            console.log(`${oldDefaultServer.ip} was listed as the default for guild ${interaction.guildId}`);
			return;
		}

		let newDefaultServer = await findServer(interaction.options.getString('server'), ['ip', 'nickname'], interaction.guildId);
		if (await isNotMonitored(newDefaultServer, interaction)) return;
		if (await isDefault(newDefaultServer, interaction)) return;

		let monitoredServers = await getMonitoredServers(interaction.guildId);
		oldDefaultServer.default = false;
		newDefaultServer.default = true;
		await setMonitoredServers(interaction.guildId, monitoredServers);

        console.log(`${server.ip} was set as the default for guild ${interaction.guildId}`);

		await sendMessage(interaction, 'The server has successfully been made the default for all commands.');
	}
};
