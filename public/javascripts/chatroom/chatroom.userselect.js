var chatroom = chatroom || {};

chatroom.userselect = (function (window, document) {
  var _$userSelect, _$userSelectForm, _$availableJournals, _$newJournal, _$enterUsername;

  var _cacheSelectors = function() {
    _$userSelect = $('#user_select');
    _$userSelectForm = $('#user_select_form');
    _$availableJournals = $('#available_journals');
    _$newJournal = $('#new_journal');
    _$enterUsername = $('#user_select_error');
  };

  var _populateAvailableUsers = function() {
    $.ajax({
      url: '/lj/available',
      success: function(data) {
        for (var i = 0; i < data.length; i++) {
          _$availableJournals.append('<option>' + data[i].username + '</option>');
        };
      }
    })
  };

  var _loadUser = function(username) {
    $.ajax({
      url: '/lj/' + username + '/select',
      success: function(data) {
        chatroom.sockets.selectUser(username);
        chatroom.ljdata.data = data;
      }
    })
  };

  var _bindFormSubmit = function() {
    _$userSelectForm.on('submit', function(e) {
      e.preventDefault();

      var newUsername = _$newJournal.val();
      var selectedUsername = _$availableJournals.find(':selected').val();

      if(newUsername != '') {
        _$enterUsername.addClass('hidden');
        _loadUser(newUsername);
      } else if(selectedUsername != '') {
        _$enterUsername.addClass('hidden');
        _loadUser(selectedUsername);
      } else {
        _$enterUsername.removeClass('hidden');
      }
    });
  };

  var self = {
    init: function() {
      _cacheSelectors();
      _populateAvailableUsers();
      _bindFormSubmit();
    }
  }; 

  return self;
})(this, this.document);