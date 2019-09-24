# mcstatusbot
A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that pings [Minecraft](https://minecraft.gamepedia.com) servers using the [mc-ping-updated](https://www.npmjs.com/package/mc-ping-updated) node module.

This bot is currently compatible with post-1.8 vanilla, Spigot, Waterfall, and Bungeecord servers. Other types of servers are partially supported with varying degrees of comaptbility.

# Setup & Configuration
- Follow a Discord.js bot quickstart guide ([An Idiot's Guide](https://anidiots.guide/getting-started/getting-started-long-version), [DevDungeon](https://www.devdungeon.com/content/javascript-discord-bot-tutorial), etc.) up to the step where you have a functioning bot and bot user, then replace your `mybot.js` file with `mcbot.js` (or just copy and paste the code from the latter into the former)
- Install any Node dependencies you're missing ([mc-ping-updated](https://www.npmjs.com/package/mc-ping-updated), [chalk](https://www.npmjs.com/package/chalk), [markdown-escape](https://www.npmjs.com/package/markdown-escape)) by opening the command line, navigating to the bot's directory, and running `npm install [name]` for each package you need to install.

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
