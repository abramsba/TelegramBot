
TelegramBot
===========

**TelegramBot** is a simple node based module for creating programs which make use of telegram bots. 

https://core.telegram.org/bots
https://core.telegram.org/bots/api

## Creating A Bot

1. Create a new bot on telegram via `@BotFather` and receive a token.
2. Require `telegrambot.js` in your node application
3. Create a new instance of `TelegramBot` and pass the token you received from `@BotFather`
4. Either have a webhook URL already set or supply one via the function `setWebhook`
5. Add new commands by using the function `addCommand`
6. Override the functions in `TelegramBot.functions` 
7. Enjoy!

This module only supports updating via `setWebhook` and not `getUpdates`. 

```js

// https://github.com/abramsba/TelegramBot/blob/master/telegrambot.js#L6
// Create a new instance of a bot and supply your token. When created
// the 'getMe' method will be called to receive the name and id of the bot
var bot = new TelegramBot('<token here>');

// https://github.com/abramsba/TelegramBot/blob/master/telegrambot.js#L176
// Supply a URL which is listening for updates
bot.setWebhook( 'https://url.to.hook/' );

// https://github.com/abramsba/TelegramBot/blob/master/telegrambot.js#L135
// Add a command 'test', arguments are space seperated. URL encoding is supported
bot.addCommand( 'test', function( id, from, chat, date, arguments ) {
  console.log( from, chat, arguments );
});

// https://github.com/abramsba/TelegramBot/blob/master/telegrambot.js#L11
bot.functions.onPlainText = function( id, from, chat, date, message ) {
  console.log("This will be called when a normal text message is received.", id, from, chat, date, message);
}

```

