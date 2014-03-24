var chatroom = chatroom || {};

chatroom.chatwindow = (function (window, document) {
  var _$chatWindow;

  var _cacheSelectors = function() {
    _$chatWindow = $('#chat_window');
  }
  
  var self = {
    init: function() {
      _cacheSelectors();
    },

    addStringToChatWindow: function(className, speaker, string) {
      $chatWindow.append($('<li class="' + className + '"></li>').append('<span class="speaker">' + speaker + ':</span>' + string));
      $chatWindow.scrollTop(100000);
    }
  }; 

  return self;
})(this, this.document);