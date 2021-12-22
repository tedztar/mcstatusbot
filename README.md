# mcstatusbot
A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that pings [Minecraft](https://minecraft.gamepedia.com) servers using the [mcping-js](https://www.npmjs.com/package/mcping-js) node module.

This bot is currently compatible with post-1.8 vanilla servers. Other types of servers may be partially supported with varying degrees of compatibility.

# Setup & Configuration

## Invite the Bot
- [Invite](https://discord.com/api/oauth2/authorize?client_id=888202509552861224&permissions=268435472&scope=bot%20applications.commands) the bot to your server
- 

## Heroku Deployment
- Follow [this](https://discordjs.guide/preparations/setting-up-a-bot-application.html) guide and [this](https://discordjs.guide/preparations/adding-your-bot-to-servers.html) guide to set up and invite the bot to your server
- Fill out the configuration variables using your client ID (found in the "OAuth2" section of the Discord Developer Portal), and bot token (found in the "Bot" section of the Discord Developer Portal)

# Commands
- `/help` - List the other commands
- `/status [ip]` - Displays the current status and active players for the default server or the specified IP address
- `/monitor ip` - Monitor the server with the specified IP address
- `/unmonitor ip|all` - Unmonitor the server with the specified IP address or all servers

# To-Do
- Switch fields in server status embed to code snippets
- If no ip specified for status command and guild array is blank throw error