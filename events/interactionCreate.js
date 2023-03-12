const { Events } = require('discord.js');

const name = Events.InteractionCreate;
const once = false;

async function execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await interaction.deferReply({ ephemeral: true });
        await command.execute(interaction);
    } catch (error) {
        if (interaction.replied || interaction.deferred) {
            let commandOptions = getCommandOptions(interaction);

            console.warn(
                `Error executing command
                        Guild ID: ${interaction.guildId}
                        Command: /${interaction.commandName}
                        Command Options: ${commandOptions ? JSON.stringify(commandOptions) : 'None'}`
            );
            console.log(error);

            await interaction.editReply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        } else {
            console.warn(
                `Error deferring reply to command
                        Guild ID: ${interaction.guildId}
                        Command: /${interaction.commandName}`
            );

            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }
    }
}

function getCommandOptions(interaction) {
    let commandOptions = [];
    for (option of interaction.options.data) {
        const filteredData = ['name', 'value'];
        let filteredOption = Object.keys(option)
            .filter(data => filteredData.includes(data))
            .reduce((obj, key) => {
                obj[key] = option[key];
                return obj;
            }, {});
        commandOptions.push(filteredOption);
    }
    return commandOptions.length ? commandOptions : null;
}

module.exports = { name, once, execute };
