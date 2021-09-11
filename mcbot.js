const Discord = require("discord.js");
const mcping = require('mcping-js');
const fs = require('fs');
const settings = require('./config.json');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS] });
const server = new mcping.MinecraftServer(settings.ip, settings.port);

async function getServerStatus() {
	server.ping(10000, settings.protocolversion, async function (err, res) {
		if (!(typeof err === 'undefined' || err === null)) {
			client.user.setStatus('dnd');
			serverStatus = 'Server offline';
			client.user.setActivity(serverStatus, { type: 'PLAYING' });
			return;
		}
		if (typeof res.players.sample === 'undefined') { client.user.setStatus('idle'); }
		if (!(typeof res.players.sample === 'undefined')) { client.user.setStatus('online'); }
		let maxPlayers;
		if (settings.maxplayers == 'default') { maxPlayers = res.players.max }
		else if (settings.maxplayers == 'memberCount') {
			const guild = client.guilds.cache.get(settings.guildid);
			const fetchedMembers = await guild.members.fetch();
			maxPlayers = String(fetchedMembers.filter(member => !member.user.bot).size);
		}
		else { maxPlayers = settings.maxplayers }
		serverStatus = res.players.online + ' / ' + maxPlayers;
		client.user.setActivity(serverStatus, { type: 'PLAYING' });
	})
}

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

//Command Handler
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//Event Handler
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Startup Handler
client.once('ready', () => {
	console.log('Ready!');
	getServerStatus();
	setInterval(getServerStatus, settings.pinginterval * 1000);
});

client.login(settings.token);