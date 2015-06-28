
var _ = require('underscore');

/*
 * Simple echo command which repeats what you said to it
 */
module.exports = function( bot ) {
  bot.addCommand( 'echo', function( from, chat, args ) {
    var message = 'Testing... Testing...\n';
    message += 'I received a command from '+from.first_name+' '+from.last_name+'.\n';
    if ( args.length > 0 ) {
      message += 'Commando Argumenten: \n';
      _.each( args, function(arg, index) {
        message += index+' > '+decodeURIComponent(arg)+'\n';
      });
    }
    bot.sendMessage( chat.id, message ).then( function(body) {}, console.log );
  });
}



