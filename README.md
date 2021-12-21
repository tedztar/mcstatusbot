# mcstatusbot
A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that pings [Minecraft](https://minecraft.gamepedia.com) servers using the [mcping-js](https://www.npmjs.com/package/mcping-js) node module.

This bot is currently compatible with post-1.8 vanilla servers. Other types of servers may be partially supported with varying degrees of compatibility.

# Setup & Configuration
- Install NodeJS from [here](https://nodejs.org/en/download/)
- Follow [this](https://discordjs.guide/preparations/setting-up-a-bot-application.html) guide and [this](https://discordjs.guide/preparations/adding-your-bot-to-servers.html) guide to set up and invite the bot to your server
- Download and unzip this repository, open a terminal window in the repository folder and run `npm i`
- Edit the `config.json` file to provide your guild ID (found using [this](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) method), client ID (found in the "OAuth2" section of the Discord Developer Portal), and bot token (found in the "Bot" section of the Discord Developer Portal)
- Optional: change the other settings in the file (these can also be changed with the `/settings` bot command)
- Go back to the terminal window and run `node deploy-commands.js`
- Start the bot by running `start.bat` (Windows)

# Commands
- `/help` - List the other commands
- `/status` - Displays the current status and active players for your server
- `/settings` - Change the settings of the bot
    - `/settings ip` - Change the IP address of the server being monitored
    - `/settings port` - Change the port of the server being monitored
    - `/settings protocolversion` - Change the protocol version of the server being monitored. The values are based on the server version and are listed [here](https://wiki.vg/Protocol_version_numbers)
    - `/settings pinginterval` - Change how often the bot checks the server's status (in seconds)
    - `/settings maxplayers` - Change the displayed max number of players online. 'default' sets this number to the Minecraft server's maximum capacity, 'memberCount' sets this number to the Discord server's member count, and an integer will display a static number
- `/restart` - Restart the bot if it's not working correctly

# To-Do
- Switch from activity status to voice channel update for server status
- Support for monitoring multiple Minecraft servers with voice channels
- Switch fields in server status embed to code snippets
- Switch from self-host to global-host for bot
- Per-server settings using Keyv or Enmap