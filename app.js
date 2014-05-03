
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var auth = express.basicAuth(process.env.RESETUSER, process.env.RESETAUTH);

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
app.get('/lj/available/reset', auth, routes.resetAvailableJournals);
app.get('/lj/available', routes.getAvailableJournals);

app.get('/lj/:username', routes.getJournal);
app.get('/lj/:username/select', routes.selectJournal);
app.get('/lj/:username/deselect', routes.deselectJournalWeb);

// app.get('/game', game.index);
app.get('/', function(req, res) {
  res.render('game', { title: 'Adventures of Teen Bloggers', env: app.get('env') });
});

var server = http.createServer(app);
io = io.listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {
  socket.on('message', function(message) {
    socket.get('ljusername', function(err, username) { 
      socket.broadcast.emit('message', {username: username, message: message.text});
    });
  });
  socket.on('userselect', function(username) {
    console.log('registered user ' + username);
    socket.set('ljusername', username);
  });
  socket.on('enterchatroom', function() {
    socket.set('chatting', true, function() {
      socket.get('ljusername', function(err, username) {
        getChattingClients(function(chattingClients) {
          socket.emit('allusers', {clients: chattingClients});
        });

        socket.broadcast.emit('newuser', username);
      });
    });
  });
  socket.on('disconnect', function() {
    socket.get('ljusername', function(err, username) { 
      console.log('unregistered user ' + username);
      socket.broadcast.emit('userdisconnect', username);
      routes.deselectJournal(username);
    });
  });
});

function getChattingClients(callback) {
  var clients = io.sockets.clients();
  var chattingClients = [];
  var completedClients = 0;

  for (var i = 0; i < clients.length; i++) {
    var client = clients[i];
    client.get('chatting', function(err, chatting) {
      completedClients++;
      if(chatting) {
        client.get('ljusername', function(err, username) {
          chattingClients.push(username);
          if(completedClients == clients.length) callback(chattingClients);
        });
      }
    });
  };
}
