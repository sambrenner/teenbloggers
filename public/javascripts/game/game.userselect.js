var game = game || {};

game.userselect = (function(window, document) {
  var _$availableJournals, _$userSubmit, _$characterSelect;

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
      _$availableJournals.combobox();
      _$userSubmit.css('height', $('#combobox').outerHeight());
      _$characterSelect.addClass('hidden');
    }
  };

  return self;
})(this, this.document);