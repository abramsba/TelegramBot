
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
 * Given a map where the key is the parameter and the value is the argument
 * Build up a URL for calling a service
 */
TelegramBot.prototype.buildURI = function( resource, params ) {
  var param_keys = params != undefined ? _.keys(params) : [];
  var uri_resource = this.api_url + '/' + resource;
  var uri_params = "";
  _.each( param_keys, function(key, index) {
    var uri_param = key + '=' + encodeURIComponent( params[key] );
    if ( index != param_keys.length - 1 ) 
      uri_param += "&";
    uri_params += uri_param;
  });
  if ( uri_params.length != 0 ) {
    uri_resource += "?" + uri_params
  }
  return uri_resource;
}

/*
 * Send a HTTPS request and return a promise
 */
TelegramBot.prototype.httpsRequest = function( url ) {
  return new promise( function(fulfill, reject) {
    request( url, function( error, response, body ) {
      if(error) reject(error);
      else fulfill(body);
    });
  });
}

/*
 * https://core.telegram.org/bots/api#getme
 * A simple method for testing your bot's auth token. 
 */
TelegramBot.prototype.getMe = function() {
  var url = this.buildURI( 'getMe' );
  return this.httpsRequest(url);
}

/*
 * https://core.telegram.org/bots/api#sendmessage
 * Use this method to send text messages. On success, the sent Message is returned. 
 */
TelegramBot.prototype.sendMessage = function( chat_id, text, disable_web_page_preview, reply_to_message_id, reply_markup ) {
  var params = { chat_id: chat_id, text: text };
  if ( disable_web_page_preview != undefined ) 
    params.disable_web_page_preview = disable_web_page_preview;
  if ( reply_to_message_id != undefined ) 
    params.reply_to_message_id = reply_to_message_id;
  if ( reply_markup != undefined ) 
    params.reply_markup = reply_markup;
  return this.httpsRequest( this.buildURI( 'sendMessage', params ) );
}

/*
 * https://core.telegram.org/bots/api#forwardmessage
 * Use this method to forward messages of any kind. On success, the sent Message is returned.
 */
TelegramBot.prototype.forwardMessage = function( chat_id, from_chat_id, message_id ) {
  var params = { chat_id: chat_id, from_chat_id: from_chat_id, message_id: message_id };
  return this.httpsRequest( this.buildURI( 'forwardMessage', params ) );
}

/*
 * https://core.telegram.org/bots/api#sendphoto
 * Use this method to send photos. On success, the sent Message is returned.
 */
TelegramBot.prototype.sendPhoto = function( chat_id, photo, caption, reply_to_message_id, reply_markup ) {
  var params = { chat_id: chat_id, photo: photo };
  if ( caption != undefined ) 
    params.caption = caption;
  if ( reply_to_message_id != undefined ) 
    params.reply_to_message_id = reply_to_message_id;
  if ( reply_markup != undefined ) 
    params.reply_markup = reply_markup;
  return this.httpsRequest( this.buildURI( 'sendPhoto', params ) ); 
}

/*
 * https://core.telegram.org/bots/api#sendaudio
 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS
 */
TelegramBot.prototype.sendAudio = function( chat_id, audio, reply_to_message_id, reply_markup ) {
  var params = { chat_id: chat_id, audio: audio };
  if ( reply_to_message_id != undefined ) 
    params.reply_to_message_id = reply_to_message_id;
  if ( reply_markup != undefined )
    params.reply_markup = reply_markup;
  return this.httpsRequest( this.buildURI( 'sendAudio', params ) );
}

/*
 * https://core.telegram.org/bots/api#senddocument
 * Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size
 */
TelegramBot.prototype.sendDocument = function( chat_id, document, reply_to_message_id, reply_markup ) {
  var params = { chat_id: chat_id, document: document };
  if ( reply_to_message_id != undefined )
    params.reply_to_message_id = reply_to_message_id;
  if ( reply_markup != undefined )
    params.reply_markup = reply_markup;
  return this.httpsRequest( this.buildURI( 'sendDocument', params ) );
}

/*
 * https://core.telegram.org/bots/api#sendvideo
 * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document).
 */
TelegramBot.prototype.sendVideo = function( chat_id, video, reply_to_message_id, reply_markup ) {
  var params = { chat_id: chat_id, video: video };
  if ( reply_to_message_id != undefined ) 
    params.reply_to_message_id = reply_to_message_id;
  if ( reply_markup != undefined )
    params.reply_markup = reply_markup;
  return this.httpsRequest( this.buildURI( 'sendVideo', params ) );
}

/*
 * https://core.telegram.org/bots/api#sendchataction
 * Use this method when you need to tell the user that something is happening on the bot's side.
 */
TelegramBot.prototype.sendChatAction = function( chat_id, action ) {
  var params = { chat_id: chat_id, action: action };
  return this.httpsRequest( this.buildURI( 'sendChatAction', params ) );
}

module.exports = TelegramBot;

