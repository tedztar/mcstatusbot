![Discord Server Count](https://img.shields.io/endpoint?url=https%3A%2F%2Frunkit.io%2Fthedjchi%2Fmcstatus-discordbot%2Fbranches%2Fmaster)
![Make A Donation](https://img.shields.io/static/v1?label=&message=Donate&color=d9b811&logo=buymeacoffee&logoColor=white&link=https://www.buymeacoffee.com/rahulrao)

# Minecraft Server Status - Discord Bot

A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that displays the status of [Minecraft](https://minecraft.gamepedia.com) servers using the [mcping-js](https://www.npmjs.com/package/mcping-js) library.

**To use:** Simply [invite](https://discord.com/api/oauth2/authorize?client_id=788083161296273517&permissions=268435472&scope=bot%20applications.commands) the bot to your server

**Enjoying our bot?** Our bot is completely free to use, and will always remain so. A [donation](https://www.buymeacoffee.com/rahulrao) of any amount helps keep our server running!

## Now Updated!!

- Updated Feb 2023
- Default server option has been implemented! Set a monitored server to be the default for all commands so that you don't have to constantly type in the nickname or IP address
- Nicknames have been implemented! Set a nickname for your server with the `/nickname` command. You can refer to the server using its nickname in all commands!

## Features

- Self-updating voice channels to display the server's status and the number of players online
- Support for monitoring multiple Minecraft servers at once
- See the usernames of the players on the server
- Check the status of non-monitored servers
- Slash command support with ephemeral responses to prevent channels from being cluttered with commands

## Usage

- `/status [server|ip]` - Displays the current status and active players for any server
- `/monitor ip [nickname]` - Create 2 voice channels that display the status of a Minecraft server and optionally set a nickname
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
- [ ] Support compatibility with bedrock servers (see [thid](https://www.npmjs.com/package/minecraft-server-util?activeTab=readme) package)

### Backend Updates
- [ ] Update readme with screenshots
- [ ] Fix async/await and for vs forEach usage
- [x] Implement optional success and error message pass-through in console
- [x] Move error logging to own file 
- [ ] IP address validation
