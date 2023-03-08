const mcping = require('mcping-js');
const unidecode = require('unidecode');

module.exports = {
    getServerStatus(serverIp, timeout) {
        let [ip, port] = serverIp.split(':');
        ip = unidecode(ip);
        port = parseInt(port || 25565);

        const mcserver = new mcping.MinecraftServer(ip, port);

        return new Promise((resolve) => {
            mcserver.ping(timeout, 47, (error, response) => {
                let results = Object.assign({ isOnline: !error ? true : false }, response);
                resolve(results);
            });
        })
    }
}