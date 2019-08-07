# mcstatusbot
### Discord bot for server status

:warning: For settings, please rename `config.example.json` to `config.json`.
Heroku setup further down.

# Setup: Self-Hosting

- Step 1: Dowload and extract the zip file into the folder of your choice.
- Step 2: Go to https://nodejs.org/en/download/.
- Step 3: Dowload and install `node.js`.
- Step 4: Open the folder you extracted the files too earlier.
- Step 5: Click in the bar above the files like in https://imgur.com/a/ykc0BWL and make sure all text in the box is highlighted as show in the photo.
- Step 6: Type `cmd` and press enter.
- Step 7: Paste in the command prompt `npm install`.
- Step 8: Head over to the discord applicatons page (here https://discordapp.com/developers/applications/).
- Step 9: Click “**new application**”. Give it a name, picture and description.
- Step 10: Press Bot on the left hand side of the screen then press “**Add bot**” and click “**Yes, Do It!**” when the dialog pops up.
- Step 11: Copy down the bot token This is what is used to login to your bot later.
- Step 12: Rename `config.example.json` to `config.json` if not already done so.
- Step 13: Open "config.json" with code editing software like Notepad++ or Visual Studio Code.
- Step 14: Where it says `YOUR BOT TOKEN HERE` replace that text with your bot token you copied earlier.
- Step 15: Where it says `YOUR MC SERVER IP HERE` replace that text with your server ip.
- Step 16: Where it says `YOUR MC SERVER PORT HERE` replace that text with your server port.
- Step 17: Save the "config.json file and close it.
- Step 19: Double click `run.bat` to start the bot.

# Running: Self-Hosted Bot

Way 1: Run the file `run.bat` like you would run a `.exe`

Way 2: Click in the bar above the files like in https://imgur.com/a/ykc0BWL and make sure all text in the box is highlighted as show in the photo and replace it all with cmd
In cmd paste in 
```js 
npm start
```
then press the enter key.

# Setup: Heroku-Hosted Bot

- Step 1: Head over to the discord applicatons page (here https://discordapp.com/developers/applications/).
- Step 2: Click “**new application**”. Give it a name, picture and description.
- Step 3: Press Bot on the left hand side of the screen then press “**Add bot**” and click “**Yes, Do It!**” when the dialog pops up.
- Step 4: Copy down the bot token This is what is used to login to your bot later.
- Step 5: Press this button: [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Huskydog9988/mcstatusbot).
- Step 6: Name your app and choose a region that you prefer.
- Step 7: Fill in each `Config Var` with the requested information.
- Step 8: Press `Deploy app` to start your bot.

# Running: Heroku-Hosted Bot

Under the deploy tab scroll to the bottom and make sure "Manual Deploy" looks like this -> https://imgur.com/a/rVrRw3z. If so, then press `Deploy Branch`

# Inviting You Bot

Click [here](https://discordapp.com/developers/applications/) and select the app you made for the bot then press `Copy` under `Client ID`. Paste the `Client ID` into the `Client ID` field on the website [here](https://discordapi.com/permissions.html) like in [here](https://imgur.com/a/PXU3y03). Then press the link provided below and invite your bot!
