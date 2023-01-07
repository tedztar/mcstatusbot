[![Discord Bots](https://top.gg/api/widget/servers/788083161296273517.svg)](https://top.gg/bot/788083161296273517)

# Minecraft Server Status - Discord Bot

A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that displays the status of [Minecraft](https://minecraft.gamepedia.com) servers using the [mcping-js](https://www.npmjs.com/package/mcping-js) node module.

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

## Invite the Bot

- [Invite](https://discord.com/api/oauth2/authorize?client_id=788083161296273517&permissions=268435472&scope=bot%20applications.commands) the bot to your server

## Usage

- Use `/monitor ip` (replace `ip` with the IP address of the server you would like to monitor) to create two self-updating voice channels that display the server's status and the number of players online
- Use `/status` to get a detailed report of the default server's status (the first server that was monitored that hasn't been unmonitored). This detailed report includes the server's status, the number of players online, a list of usernames corresponding to the players online, and the server's version
- Use `/status ip` to get a detailed report of the specified server's status
- Use `/unmonitor ip` to delete the self-updating channels corresponding to the specified server
- Use `/unmonitor all` to delete all of the self-updating channels. This should be done prior to removing the bot from the server

## Commands

- `/help` - List the other commands
- `/status [ip]` - Displays the current status and active players for the default server or the specified IP address
- `/monitor ip` - Monitor the server with the specified IP address
- `/unmonitor ip|all` - Unmonitor the server with the specified IP address or all servers

## To-Do

- Allow users to manage default server for `/status` command (`/default ip` command and `/monitor ip [default]` option, add new key-value pair to server object and use findIndex to get default server)
- Allow users to set a nickname for the server (`/nickname` command and `/monitor ip nickname`)
- Add graph support (see [this](https://github.com/cappig/MC-status-bot) repository)
