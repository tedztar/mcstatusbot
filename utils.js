const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.mcUpdate = function (client, url) { 
    /*seconds = seconds + 1;
    secondsString = seconds.toString();
    client.user.setActivity(secondsString, { type: 'Playing' })
    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    .catch(console.error);*/
    request(url, function(err, response, body) {
        if(err) {
            console.log(err);
            //return message.reply('Error getting Minecraft server status...');
        }
        body = JSON.parse(body);
        var status = 'Server offline';
        console.log(body.motd);
        if(body.online) {
            if((body.motd=="&cWe are under maintenance.")||(body.players.now>=body.players.max)){
                client.user.setStatus('idle')
                //.then(console.log)
                .catch(console.error);
                status = 'Server under maintenance';
            }else{
                client.user.setStatus('online')
                //.then(console.log)
                .catch(console.error);
            }
                if(body.players.now) {
                    status = ' ' + body.players.now + '  of  ' + body.players.max;
                } else {
                    status = ' 0  of  ' + body.players.max;
            }
        } else {
            client.user.setStatus('dnd')
            //.then(console.log)
            .catch(console.error);
    
        }
        client.user.setActivity(status, { type: 'PLAYING' })
        .then(presence => console.log(status))
        .catch(console.error);
    });
}

module.exports.log = function (msg) { 
    console.log(msg);
}

module.exports.kill = function (code, error) {
    console.log(error);
    process.exit(code);
}

module.exports.ping = async function (host, port, pong) { 
    var started = new Date().getTime();
  
    var http = new XMLHttpRequest();
  
    http.open("GET", "http://" + host + ":" + port, /*async*/true);
    http.onreadystatechange = function() {
      if (http.readyState == 4) {
        var ended = new Date().getTime();
  
        var milliseconds = ended - started;
        console.log(`Pinged "${host}:${port}" with a delay of ${milliseconds} milliseconds`);
  
        if (pong != null) {
          pong(milliseconds);
        }
      }
    };
    try {
      http.send(null);
    } catch(exception) {
      // this is expected
    }
}

module.exports.findConfig = function () {
    let requiredModule = null; // or a default object {}

    let pathToModule = path.join(__dirname, 'config.json');
    if (fs.existsSync(pathToModule)) {
        requiredModule = require(pathToModule);
    }

    return requiredModule;
}