//this file is not used yet!\
 function getDate() {
     date = new Date();
     cleanDate = date.toLocaleTimeString();
 }

 function getServerStatus() {
     mcping(settings.ip, settings.port, function(err, res) {
         if (!(typeof err === 'undefined' || err === null)) {
             client.user.setStatus('dnd');
             serverStatus = 'Server offline';
             client.user.setActivity(serverStatus, { type: 'PLAYING' });
             getDate()
             console.log((chalk.yellow('\[' + cleanDate + '\]:') + chalk.white(' Ping: ' +
                 'Error getting server status')));
             console.error(err);
             return;
         }
         if (typeof res.players.sample === 'undefined') { client.user.setStatus('idle') }
         if (!(typeof res.players.sample === 'undefined')) { client.user.setStatus('online') }
         serverStatus = res.players.online + ' / ' + res.players.max;
         getDate()
         client.user.setActivity(serverStatus, { type: 'PLAYING' }).then(presence => console.log(
             chalk.cyan('\[' + cleanDate + '\]:') + chalk.white(' Ping: ' + serverStatus)
         )).catch(console.error);
     })
 }

