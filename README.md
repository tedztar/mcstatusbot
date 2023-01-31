![Discord Bots](https://badgen.net/https/achiommino.npkn.net/mcstatus-discordbot/)

# Minecraft Server Status - Discord Bot

A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that displays the status of [Minecraft](https://minecraft.gamepedia.com) servers using the [mcping-js](https://www.npmjs.com/package/mcping-js) node module.

**To use:** Simply [invite](https://discord.com/api/oauth2/authorize?client_id=788083161296273517&permissions=268435472&scope=bot%20applications.commands) the bot to your server

## Now Updated!!

- Updated Jan 2023
- New hosting provider
- Bot will be hosted centrally from now on
- Fixing bugs from now till Feb and then focusing on new features

## Features

- Self-updating voice channels to display the server's status and the number of players online
- Support for monitoring multiple Minecraft servers at once
- See the usernames of the players on the server
- Check the status of non-monitored servers
- Slash command support with ephemeral responses to prevent channels from being cluttered with commands

## Usage

- `/status [server|ip]` - Displays the current status and active players for any server
- `/monitor ip [nickname]` - Create 2 voice channels that display the status of a Minecraft server and optionally set a nickname
- `/nickname [server] nickname` - Change the nickname of a monitored Minecraft server
- `/unmonitor [server|all]` - Unmonitor the specified server or all servers
- `/bug description` - Send a bug report to the maintainers
- `/help` - List the other commands

## To-Do

- [ ] Allow users to manage default server for `/status` command (`/default ip` command and `/monitor ip [default]` option, add new key-value pair to server object and use findIndex to get default server)
- [x] Allow users to set a nickname for the server (`/nickname` and `/monitor ip nickname`)
- [ ] Rework admin permissions
- [ ] Rework status, nickname, and unmonitor commands to include dropdown menus
- [ ] Rework monitor and nickname commands to include modal workflow
- [ ] Add graph support (see [this](https://github.com/cappig/MC-status-bot) repository)
- [ ] Update readme with screenshots
- [ ] Rectify backend caching
- [ ] Fix DDNS support issues
- [x] Add bug reporting command
- [ ] Support compatibility with bedrock servers