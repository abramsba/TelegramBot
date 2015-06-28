
var _ = require('underscore');
var request = require('request');
var promise = require('promise'); 

var TelegramBot = function( token ) {
  this.api_url           = 'https://api.telegram.org/bot' + token;
  this.command_character = '/';
  this.commands          = {};
}

/*
 * https://core.telegram.org/bots/api#setwebhook
 * When the webhook is called, this function is called and proceeds with execution
 * if the updated message text contains a command.
 */
TelegramBot.prototype.onUpdate = function( message ) {
  //console.log( "chat?", this.isChat(message) );
  //console.log( "command?", this.isCommand(message) );
  if ( this.isChat(message) && this.isCommand(message) ) {
    this.onCommand( message.from, message.chat, this.parseArguments(message.text) );
  }
}

/*
 * Returns true if the first character of the message text is a '/'
 */
TelegramBot.prototype.isCommand = function( message ) {
  return message.text[0] === this.command_character;
}

/*
 * Returns true if the message is from a group or sent to the bot individually
 */
TelegramBot.prototype.isChat = function( message ) {
  return message.text != undefined;
}

/*
 * Split the string at spaces and return the arguments
 */
TelegramBot.prototype.parseArguments = function( text ) {
  var args_parsed = [];
  var args_split  = text.split(" ");
  _.each( args_split, function(arg, index) {
    if ( index == 0 ) 
      args_parsed.push( arg.substring(1, arg.length) );
    else 
      args_parsed.push( decodeURIComponent(arg) );
  });
  return args_parsed;
}

/*
 * Add a command to be executed when a user calls a command
 */
TelegramBot.prototype.addCommand = function( name, callback ) {
  if ( this.commands[name] != undefined ) return false;
  this.commands[name] = callback;
}

/*
 * Searches & executes a command loaded from a module and returns a promise
 * fulfill is called if the command was found and processed succesfully
 * reject is called if the command doesn't exist or errors occured during execution
 */
TelegramBot.prototype.onCommand = function( from, chat, args ) {
  var run = this.commands[args[0]];
  if ( run == undefined ) return;
  run( from, chat, args.splice( 1, args.length ) );
}

/*
 * Sends a HTTPS GET request and returns a promise if successful 
 */
TelegramBot.prototype.sendMessage = function( chat_id, text ) {
  var uri_chat = 'chat_id=' + encodeURIComponent(chat_id);
  var uri_text = 'text=' + encodeURIComponent(text);
  var url = this.api_url + '/sendMessage?' + uri_chat + '&' + uri_text; 
  return new promise( function(fulfill, reject) {
    request( url, function( error, response, body ) {
      if(error)
        reject(error);
      else
        fulfill(body);
    });
  });
}

module.exports = TelegramBot;
