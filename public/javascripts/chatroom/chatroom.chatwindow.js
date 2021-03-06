var chatroom = chatroom || {};

chatroom.chatwindow = (function (window, document) {
  var _$chatSection, _$chatWindow, _$availableSentences, _$chatForm, _$onlineUsers;
  var _sentenceInterval;

  var _cacheSelectors = function() {
    _$chatWindow = $('#chat_window');
    _$chatSection = $('#chat');
    _$chatForm = $('#chat_form');
    _$availableSentences = $('#available_sentences');
    _$onlineUsers = $('#online_users');
  };

  var _bindFormInteraction = function() {
    _$chatForm.on('submit', function(e) {
      e.preventDefault();
      var message = _$availableSentences.val();
      if(message) {
        _$availableSentences.find(':selected').remove();

        self.addMessage('input', chatroom.ljdata.data.username, message);
        chatroom.sockets.sendMessage(message);
      }
    });
  };

  var _addRandomSentence = function(num) {
    if(!num) num = 1;

    for(var i=0; i<num; i++) {
      _$availableSentences.append('<option>' + chatroom.ljdata.getRandomSentence() + '</option>');
    }
  };

  var self = {
    init: function() {
      _cacheSelectors();
      _bindFormInteraction();
    },

    addMessage: function(className, speaker, string) {
      _$chatWindow.append($('<li class="' + className + '"></li>').append('<span class="speaker">' + speaker + ':</span>' + string));
      _$chatWindow.scrollTop(100000);
    },

    show: function() {
      _$chatSection.removeClass('hidden');
    },

    initSentenceAvailability: function() {
      _sentenceInterval = setInterval(_addRandomSentence, 30000);
      _addRandomSentence(6);
    },

    addUser: function(user) {
      _$onlineUsers.append('<li id="user_' + user + '"><a href="http://' + user + '.livejournal.com" target="_blank">' + user + '</a></li>');
    },

    removeUser: function(user) {
      $('#user_' + user).remove();
    }
  }; 

  return self;
})(this, this.document);