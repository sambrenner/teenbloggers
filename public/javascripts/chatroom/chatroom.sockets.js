var chatroom = chatroom || {};

chatroom.sockets = (function (window, document) {
  var _socket;

  var self = {
    init: function() {
      _socket = io.connect('/');
    }
  }; 

  return self;
})(this, this.document);