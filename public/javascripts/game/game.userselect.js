var game = game || {};

game.userselect = (function(window, document) {
  var self = {
    getUsernames: function(callback) {
      $.ajax({
        url: '/lj/available',
        success: function(data) {
          callback(data);
        }
      });
    }
  };

  return self;
})(this, this.document);