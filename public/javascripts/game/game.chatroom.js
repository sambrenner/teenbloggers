var game = game || {};

game.chatroom = (function(window, document) {
  var _$combobox, _$chatSection, _$chatWindow, _$availableSentences, _$chatForm, _$onlineUsers, _$chatSubmit;
  var _sentenceInterval;

  var _cacheSelectors = function() {
    _$chatWindow = $('#chat_window');
    _$chatSection = $('#chat');
    _$chatForm = $('#chat_form');
    _$availableSentences = $('#available_sentences');
    _$onlineUsers = $('#online_users');
    _$chatSubmit = $('#chat_submit');
  };
  
  var self = {
    init: function() {
      _cacheSelectors();

      _$combobox = _$availableSentences.combobox({noInput: true});
      _$chatSubmit.css('height', _$chatSection.find('.combobox').outerHeight());
    }
  };

  return self;
})(this, this.document);