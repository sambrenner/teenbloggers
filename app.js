
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var io = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/pos/:text', routes.pos);
app.get('/lj/search/:term', routes.searchJournals);
app.get('/lj/available', routes.getAvailableJournals);

app.get('/lj/:username', routes.getJournal);
app.get('/lj/:username/select', routes.selectJournal);
app.get('/lj/:username/deselect', routes.deselectJournalWeb);

var server = http.createServer(app);
io = io.listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {
  socket.on('message', function(message) {
    socket.broadcast.emit({username: socket.ljusername, message: message.text});
  });
  socket.on('userselect', function(username) {
    console.log('registered user ' + username);
    socket.ljusername = username;
  });
  socket.on('disconnect', function() {
    if(socket.ljusername) {
      console.log('unregistered user ' + socket.ljusername);
      routes.deselectJournal(socket.ljusername);
    }
  });
});
