module.exports = {
	token: process.env.token || "YOUR_BOT_TOKEN_HERE",
    commandPrefix: process.env.commandPrefix || "/",
    ip: process.env.ip || "YOUR_SERVER_IP_HERE",
    port: parseInt(process.env.port || 25565),
    pingInterval: process.env.pingInterval || "30",
    embedColor: process.env.embedColor || "7289DA",
    webPort: process.env.PORT || 3000
}
