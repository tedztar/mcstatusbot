# mcstatusbot
discrod bot for server status<br/>

# Self Host
Info for slef hosting can be found here -> https://github.com/lerokko/mcstatusbot<br/>

# Setup for Heroku

Step 1: Sign into Github (if you already haven't already) and fork this repository<br/>
<br/>
Step 2: Go to https://signup.heroku.com/login to sign up for Heroku (if you don't have an account)<br/>
<br/>
Step 3: Now go to https://id.heroku.com/login (if you where not redirected there)  and sign in<br/>
<br/>
Step 4: Now that you have signed in press "New" in the upper Rigt hand corner then press "Create new app" (Should be done at https://dashboard.heroku.com/apps)<br/>
<br/>
Step 5: Enter in any name you wish for you app to be but make it original so it can not be guessed (Just trust me on this) also chose a server region if you so wish. ALSO, DO NOT add a "pipeline". Now press "Create app"<br/>
<br/>
Step 6: Now go to the deploy tab and press "GitHub" like shown in -> https://imgur.com/gallery/QR30Fk4 and follow the directions<br/>
<br/>
Step 7: When done in text box that says "repo-name" type in "mcstatusbot" (or what you renamed the repo you forked earlier) then press search adn press "connect" next to the correct repo that the bot is in like in -> https://imgur.com/gallery/vir5jUw<br/>
<br/>
Step 8: Scroll down the page to "Automatic deploys" and under chose branch, chose the branch "heroku" like in -> 
https://imgur.com/a/KREzcrr then press "Enable Automatic Deploys"<br/>
<br/>
Step 9: Now scroll to the top and go to the settings tab, and in there press "Reveal Config Vars"<br/>
<br/>
Step 10: Make your Config Vars look like mine in -> https://imgur.com/a/LRkEW4o but replace "YOUR IP HERE" with your servers ip, then replace "YOUR PORT HERE" with the port of your server<br/>
<br/>
Step 11: Open a new tab and head over to the discord applicatons page (here https://discordapp.com/developers/applications/)<br/>
<br/>
Step 12: Click “new application”. Give it a name, picture and description<br/>
<br/>
Step 13: Press Bot on the left hand side of the screen then press “Add bot” and click “Yes, Do It!” when the dialog pops up<br/>
<br/>
Step 14: Copy down the bot token This is what is used to login to your bot later<br/>
<br/>
Step 15: Go back to the Heroku Dashboard for your bot and go to the settings tab, then go to the Config Vars again<br/>
<br/>
Step 16: Press the pencil on the line with the "key" "token" like in -> https://imgur.com/a/bmSMJTb<br/>
<br/>
Step 17: Replace "YOUR BOT TOKEN HERE" with your bot token you copied down earier like in -> https://imgur.com/a/7G3R1lP (Inactive Token BTW) then press save changes<br/>
<br/>
# Inviting your bot
Use the link https://discordapp.com/developers/applications/ and select the app you made for the bot then press "Copy" under "Client ID" and paste it into the "Client ID" feild on the website -> https://discordapi.com/permissions.html like in -> https://imgur.com/a/PXU3y03

# Running your bot

Under the deploy tab scroll to the bottom and make sure "Manual Deploy" looks like this -> https://imgur.com/a/rVrRw3z. If so, then press "Deploy Branch"
