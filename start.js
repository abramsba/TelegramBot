
var TelegramBot     = require('./telegrambot');

var _          = require('underscore');
var fs         = require('fs');
var https      = require('https');
var express    = require('express');
var bodyparser = require('body-parser');

/* copy _config.js to config.js and adjust the values as needed */
var config = require('./config');
console.log(config);

/* Start the bot and load the commands */
var bot = new TelegramBot( config.token );
_.each( fs.readdirSync('./commands'), function(file) {
  var command = file.replace('.js', '');
  require('./commands/'+command)(bot);
});

/* Prepare the web hook */
var app = express();
app.use(bodyparser.json());
app.post('/webhook', function(request, response) {
  bot.onUpdate(request.body.message);
  response.send();
});

/* start the https listener */
var options = {
  key:  fs.readFileSync( config.key ),
  cert: fs.readFileSync( config.cert )
};
var httpsServer = https.createServer( options, app );
httpsServer.listen(config.port);

