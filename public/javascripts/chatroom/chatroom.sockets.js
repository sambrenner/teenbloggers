var chatroom = chatroom || {};

chatroom.sockets = (function (window, document) {
  var _socket;

  var self = {
    init: function() {
      _socket = io.connect('/');

      _socket.on('message', function(data) {
        chatroom.chatwindow.addMessage('response', data.username, data.message);
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