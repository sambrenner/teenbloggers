var chatroom = chatroom || {};

chatroom.main = (function (window, document) {
  var self = {
    init: function() {
      chatroom.chatwindow.init();
      chatroom.userselect.init();
      chatroom.sockets.init();
    }
  }; 

  return self;
})(this, this.document);