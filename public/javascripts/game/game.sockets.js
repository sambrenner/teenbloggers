var game = game || {};

game.sockets = (function (window, document) {
  var _socket;

  var self = {
    init: function() {
      _socket = io.connect('/');

      _socket.on('message', function(data) {
        game.chatroom.addMessage('response', data.username, data.message);
      });

      _socket.on('allusers', function(data) {
        data = data.clients;

        for (var i = 0; i < data.length; i++) {
          game.chatroom.addUser(data[i]);
        };
      });

      _socket.on('newuser', function(data) {
        game.chatroom.addUser(data)
      });

      _socket.on('userdisconnect', function(data) {
        game.chatroom.removeUser(data);
      });
    },

    sendMessage: function(message) {
      _socket.emit('message', { text: message });
    },

    selectUser: function(username) {
      _socket.emit('userselect', username);
    },
  }; 

  return self;
})(this, this.document);