![Discord Bots](https://badgen.net/https/achiommino.npkn.net/mcstatus-discordbot/)
<a href="https://www.buymeacoffee.com/rahulrao"><img src="https://badgen.net/badge/Make/a%20donation/yellow"></img></a>

# Minecraft Server Status - Discord Bot

A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that displays the status of [Minecraft](https://minecraft.gamepedia.com) servers using the [mcping-js](https://www.npmjs.com/package/mcping-js) library.

**To use:** Simply [invite](https://discord.com/api/oauth2/authorize?client_id=788083161296273517&permissions=268435472&scope=bot%20applications.commands) the bot to your server

**Enjoying our bot?** Our bot is completely free to use, and will always remain so. A [donation](https://www.buymeacoffee.com/rahulrao) of any amount helps keep our server running!

## Now Updated!!

- Updated Jan 2023
- New hosting provider
- Bot will be hosted centrally from now on
- Fixing bugs from till mid Feb and then focusing on new features

## Features

- Self-updating voice channels to display the server's status and the number of players online
- Support for monitoring multiple Minecraft servers at once
- See the usernames of the players on the server
- Check the status of non-monitored servers
- Slash command support with ephemeral responses to prevent channels from being cluttered with commands

## Usage

- `/help` - List the other commands
- `/status ip?` - Displays the current status and active players for the default server (the first server that was monitored that hasn't been unmonitored) or the specified IP address if provided
- `/monitor ip` - Monitor the server with the specified IP address
- `/unmonitor ip|all` - Unmonitor the server with the specified IP address or all servers
- `/bug desc` - Send a bug report to the maintainers

## To-Do

- [ ] Allow users to manage default server for `/status` command (`/default ip` command and `/monitor ip [default]` option, add new key-value pair to server object and use findIndex to get default server)
- [ ] Allow users to set a nickname for the server (`/nickname` command and `/monitor ip nickname`)
- [ ] Add graph support (see [this](https://github.com/cappig/MC-status-bot) repository)
- [ ] Rectify backend caching
- [x] Update backend error handling
- [ ] Fix DDNS support issues
- [x] Add bug reporting command
- [ ] Support compatibility with bedrock servers
