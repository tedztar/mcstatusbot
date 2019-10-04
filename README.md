# mcstatusbot
A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that pings [Minecraft](https://minecraft.gamepedia.com) servers using the [mc-ping-updated](https://www.npmjs.com/package/mc-ping-updated) node module.

This bot is currently compatible with post-1.8 vanilla, Spigot, Waterfall, and Bungeecord servers. Other types of servers are partially supported with varying degrees of comaptbility.

# Setup & Configuration
- First install Node.js from [here](https://nodejs.org/en/download/) if not already installed.
- Then open CMD in the folder in which the bot is in and run `npm i`

Edit the `config.json` file to provide your bot token, preferred command prefix, Minecraft server IP address & port, and ping interval:
- Replace `"YOUR BOT TOKEN HERE"` with your bot token.
- Replace `"/"` with your preferred command prefix. Defaults to `/`.
- Replace `"YOUR SERVER IP HERE"` with the IP address of the Minecraft server you want to poll. Domains that redirect to IP addresses ("play.exampleserver.net") will also work.
- Replace `"25565"` with the port number of the Minecraft server you want to poll. Defaults to port 25565.
- Replace `"30"` with the frequency, in seconds, at which you want the bot to ping the server. Defaults to pinging every 30 seconds.
- Replace `"7289DA"` with the hex color code you prefer the bot's richEmbed messages to use.
- Start the bot by running `start.sh` (Linux) or `start.bat` (Windows). The bot should connect and begin polling the server.

# Default Commands
- `/help` (aliases: `/commands`, `/list`, `/bot`) - List the other commands
- `/status` (aliases: `/server`, `/online`) - Manually poll the Minecraft server whose IP address and port are listed in `config.json`, returning the server's version and a list of any online players
- `/crash` - Stop the bot. If you're using a looping `start.sh` script like the one provided, this effectively restarts the bot.
