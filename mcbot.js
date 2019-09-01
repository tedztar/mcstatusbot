//credit to vegeta897 for the request URL part from his 'Simple Minecraft server status bot'
const Discord = require("discord.js");
const request = require("request");

const client = new Discord.Client();
const http = require('http');
//const fs = require('fs');
//const path = require('path');
//const url = require('url');
//let ejs = require('ejs');

const utils = require('./utils.js');
//const settings = require('./config.json');

//const settings = require('./config.json') || require('./config.exsample.json');

try {
  settings = require('./config.json');
} catch (e) {
  settings = process.env;
  //handleErr(e);
  //utils.kill(1, 'Please create a config.json file by following the directions in README.md');
}

var defaultMcIP = settings.port || process.env.ip;
/*
if (settings.ip == 'YOUR SERVER IP HERE') {
  defaultMcIP = 'http://2b2t.org/';
}*/
var defaultMcPort = settings.port || process.env.PORT;
/*
if (settings.port == 'YOUR SERVER PORT HERE') {
  defaultMcPort = 25566;
}*/
var defaultPrefix = '!';
/*
if (settings.prefix !== 'YOUR BOT PREFIX') {
  defaultPrefix = settings.prefix;
}*/

var mcIP = process.env.ip || defaultMcIP; // Your MC server IP
var mcPort = process.env.port || defaultMcPort; // Your MC server port
var PORT = process.env.PORT || 80;

var mcCommand = '/minecraft'; // Command for triggering
var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;

var staticServe = function(req, res) {
    res.statusCode = 200;
    res.write('ok');
    return res.end();
};
var webServer = http.createServer(staticServe);

function mcUPdate () {
  /*
  seconds = seconds + 1;
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
function pIng (host, port, pong) {
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

client.on("ready", () => {
  console.log("I am ready!");
  client.setInterval(mcUPdate(client, url), 30000);
  client.setInterval(pIng("http://localhost/", 80), 30000);
});
/*client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
    update();

  }
}
);*/

client.login(process.env.token || settings.token).catch(function(){
  utils.kill(2, 'Please put a valid bot token in the config file.');
});
webServer.listen(PORT);
