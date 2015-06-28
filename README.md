
Telegram Bot
============

A generic node based program for interacting with Telegram bots.

https://core.telegram.org/bots
https://core.telegram.org/bots/api

## Usage

`npm install telegrambot`

## Adding Commands

```
var bot = new TelegramBot('<token here>');
bot.setWebhook( 'https://url.to.hook/' );
bot.addCommand( 'test', function( from, chat, arguments ) {
  console.log( from, chat, arguments );
});

```

