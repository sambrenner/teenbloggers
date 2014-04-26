var game = game || {};

game.chatroom = (function(window, document) {
  var _$chatSection, _$chatWindow, _$availableSentences, _$chatForm, _$onlineUsers, _$chatSubmit;
  var _$combobox, _$dropdownBtn, _$dropdownUl;
  var _sentenceInterval, _dropdownIsOpen;

  var _cacheSelectors = function() {
    _$chatWindow = $('#chat_window');
    _$chatSection = $('#chatroom');
    _$chatForm = $('#chat_form');
    _$availableSentences = $('#available_sentences');
    _$onlineUsers = $('#online_users');
    _$chatSubmit = $('#chat_submit');
  };

  var _bindFormInteraction = function() {
    _$chatForm.on('submit', function(e) {
      e.preventDefault();
      var message = _$availableSentences.val();
      if(message) {
        _$availableSentences.find(':selected').remove();

        self.addMessage('input', game.ljdata.data.username, message);
        game.sockets.sendMessage(message);
      }
    });
  };

  var _addRandomSentence = function(num) {
    if(!num) num = 1;

    for(var i=0; i<num; i++) {
      _$availableSentences.append('<option>' + game.ljdata.getRandomSentence() + '</option>');
    }
  };
  
  var self = {
    init: function() {
      _cacheSelectors();

      _$combobox = _$availableSentences.combobox({noInput: true});
      _$dropdownBtn = _$chatForm.find('button');
      _$dropdownUl = _$chatForm.find('ul');

      _$chatSubmit.css('height', _$chatSection.find('.combobox').outerHeight());

      _bindFormInteraction();

      _dropdownIsOpen = false;

      _$chatSection.on('click', function(e) {
        var $target = $(e.target);

        if($target[0] != _$dropdownBtn[0] && $target.parent()[0] != _$dropdownBtn[0] || _dropdownIsOpen) {
          _dropdownIsOpen = false;
          _$dropdownUl.css('display', 'none');
        } else {
          _dropdownIsOpen = true;
        }
      });
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