//credit to vegeta897 for the request URL part from his 'Simple Minecraft server status bot'
const Discord = require("discord.js");
const client = new Discord.Client();
const http = require('http');
var request = require('request');
let ejs = require('ejs');
//const settings = require('./config.json');
try {
  settings = require('./config.json');
} catch (e) {
  //handleErr(e);
  settings = require('./config.example.json');
}

var mcIP = process.env.ip || settings.ip; // Your MC server IP
var mcPort = process.env.port ||settings.port || 25566; // Your MC server port
var PORT = process.env.PORT || 80;

var statustring = "No signal";
var mcCommand = '/minecraft'; // Command for triggering
var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;

function update() {
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
client.on("ready", () => {
  console.log("I am ready!");
  client.setInterval(update,30000);
});

/*client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
    update();

  }
}
);*/

client.login(process.env.token || settings.token);

http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  //res.write(`<img src="https://mcapi.us/server/image?ip=${mcIP}&port=${mcPort}" alt="${mcIP} Server Info"`);
  res.end(`<img src="https://mcapi.us/server/image?ip=${mcIP}&port=${mcPort}" alt="${mcIP} Server Info"`);
}).listen(PORT);
