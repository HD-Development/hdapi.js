# HD Development API

An API Wrapper for [HD Development API](https://hd-development.glitch.me/api/bots)

<div align="center">
    <p>
		<a href="https://npmjs.com/package/hdapi.js"><img src="https://nodei.co/npm/hdapi.js.png?downloads=true&stars=false"/></a>
		<br>
		<a href="https://discord.gg/GnwnMpB"><img src="https://discordapp.com/api/guilds/480207403992743937/embed.png"/></a>
		</p>
</div>

# Documentation
Coming soon but there an examples :P

## How to install
```bash
npm install hdapi.js
```

# Examples

## With async/await
```js
const Discord = require('discord.js');
const HDdev = require('hddapi.js');

const bot = new Discord.Client();

// In the future, This will requires you to have an access token to HD API
const HDapi = new HDdev("your bot's user id", "your id / bot owner id");

bot.on('ready', () => console.log("Ready!"));

bot.on('message', async message => {
    var args = message.content.split(" ").replace('.', '');

    if (messsage.content === '.bot') {
    try {
        var botData = await HDapi.getBot(args[0]);
        message.channel.send(`${botData.bot.tag} by ${botData.owner.tag} with prefix ${botData.prefix}`);
        } catch(error) {
        if(error.message === '[HDAPI] Bot not found') return message.channel.send('The bot ID you provide is not registered *yet* on HD Development');
        return console.log(error;
        } 
    }
});

bot.login('bot token');
```

## With .then() [Promises]
```js
const Discord = require('discord.js');
const HDdev = require('hdapi.js');

const bot = new Discord.Client();

// In the future, This will requires you to have an access token to HD API
const HDapi = new HDdev("your bot's user id", "your id / bot owner id");

bot.on('ready', () => console.log("Ready!"));

bot.on('message', message => {
    var args = message.content.split(" ").replace('.', '');

    if (messsage.content === '.bot') {
    try {
        HDapi.getBot(args[0]).then(botData => {
        message.channel.send(`${botData.bot.tag} by ${botData.owner.tag} with prefix ${botData.prefix}`);
        } catch(error) {
        if (error.message === '[HDAPI] Bot not found') return message.channel.send('The bot ID you provided is not registered *yet* on HD Developement.');
        }
        });
    }
});

bot.login('bot token');
```