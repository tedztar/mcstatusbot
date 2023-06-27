![Discord Server Count](https://img.shields.io/endpoint?url=https%3A%2F%2Fmcstatusbot-delegate-production.up.railway.app%2Fcount%2FgetFormatted)
[![Make A Donation](https://img.shields.io/static/v1?label=&message=Donate&color=d9b811&logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/rahulrao)

# Minecraft Server Status - Discord Bot

A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that displays the status of [Minecraft](https://minecraft.gamepedia.com) servers using the [mcstatus.io](https://mcstatus.io/) library.

**To use:** Simply [invite](https://discord.com/api/oauth2/authorize?client_id=788083161296273517&permissions=268435472&scope=bot%20applications.commands) the bot to your server

**Enjoying our bot?** Our bot is completely free to use, and will always remain so. A [donation](https://www.buymeacoffee.com/rahulrao) of any amount helps keep our server running!

> :warning: **Server validation has been added**: Servers that are not valid IP addresses, or FQDNs (domains) can no longer be monitored. The database has now been cleaned of any invalid server addresses. Large backend changes have also taken place. Please read the new pinned issue (FAQ) if you run into problems.

## New Version released!!

- Updated 27 June 2023
- Bedrock support added!! See usage below.
- Transitioned to new backend providers for database and api.
- Server validation introduced and database scrubbed.
- Adopted more efficient multi-process optimisation.
- Added server latency to status command.
- Updated icon handling to improve performance.

## Features

- Auto-updating voice channels to display the server's status and the number of players online
- Support for monitoring multiple Minecraft servers at once
- Check the status of non-monitored servers
- Slash command support with ephemeral responses to prevent channels from being cluttered with commands

## Usage

- `/status [server|ip] [type]` - Displays the current status and active players for any server. Optionally specify if the server type is bedrock / java
- `/monitor ip [nickname] [type]` - Create 2 voice channels that display the status of a Minecraft server and optionally set a nickname or a server type (bedrock / java)
- `/nickname nickname [server]` - Change the nickname of a monitored Minecraft server
- `/default server` - Set a server to be the default for all commands
- `/unmonitor [server|all]` - Unmonitor the specified server or all servers
- `/bug` - Send a bug report to the maintainers
- `/help` - List the other commands

## To-Do

### Feature Updates

- [ ] Rework status, nickname, and unmonitor commands to include dropdown menus
- [ ] Rework monitor and nickname commands to include modal workflow
- [ ] Add graph support (see [this](https://github.com/cappig/MC-status-bot) repository)
- [ ] Link Discord usernames to Minecraft accounts for player list in status command (see [this](https://github.com/dommilosz/minecraft-auth) repository)
- [ ] Add option to monitor server with message embed instead of voice channels
- [x] Support compatibility with bedrock servers (see [this](https://www.npmjs.com/package/minecraft-server-util?activeTab=readme) package)
- [x] Show ping latency for servers

### Backend Updates

- [ ] Update readme with screenshots
- [x] Remove stale rows from db
- [ ] Error logging rework
- [ ] Network request retry wrapper
- [x] Retrieve server icon from ping package instead of external API
- [x] Automate deploying commands
- [x] Fix async/await usage and parallelize for loops
- [x] Implement optional success and error message pass-through in console
- [x] Move error logging to own file
- [x] Implement shard reclustering
- [x] Server address validation
