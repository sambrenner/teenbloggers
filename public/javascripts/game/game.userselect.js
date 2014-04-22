var game = game || {};

game.userselect = (function(window, document) {
  var _$availableJournals, _$userSubmit, _$characterSelect, _$combobox;

  var _cacheSelectors = function() {
    _$availableJournals = $('#available_journals');
    _$characterSelect = $('#character_select');
    _$userSubmit = $('#user_submit');
  };

  var self = {
    init: function() {
      _cacheSelectors();
    },

    seedUsernames: function(callback) {
      $.ajax({
        url: '/lj/available',
        success: function(data) {
          for(var i=0; i<data.length; i++) {
            _$availableJournals.append('<option>' + data[i].username + '</option>');
          }
        }
      });

      _$characterSelect.removeClass('hidden');
      _$combobox = _$availableJournals.combobox();
      _$userSubmit.css('height', $('#combobox').outerHeight());
      _$characterSelect.addClass('hidden');
    },

    loadUser: function(username) {
      $.ajax({
        url: '/lj/' + username + '/select',
        success: function(data) {
          game.sockets.selectUser(username);
          // chatroom.ljdata.data = data;
          // chatroom.chatwindow.show();
          // chatroom.chatwindow.initSentenceAvailability();
          // self.hide();
        }
      });
    },

    getComboboxValue: function() {
      return $('#combobox').val();
    }
  };

  return self;
})(this, this.document);