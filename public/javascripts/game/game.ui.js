var game = game || {};

game.ui = (function(window, document) {
  var _$window, _$gameWindow, _$footer, _gameWindowHalfHeight;

  var _cacheSelectors = function() {
    _$window = $(window);
    _$gameWindow = $('#main_content');
    _$footer = $('footer');

    _gameWindowHalfHeight = _$gameWindow.height() / 2;
    _gameWindowHalfWidth = _$gameWindow.width() / 2;
  };

  var _bindWindowResize = function() {
    _$window.on('resize', function() {
      var top = Math.max(0,window.innerHeight / 2 - _gameWindowHalfHeight);
      var left = Math.max(0,window.innerWidth / 2 - _gameWindowHalfWidth);

      _$gameWindow.css('top', top);
      _$gameWindow.css('left', left);

      _$footer.css('top', top + 490);
      _$footer.css('left', left);
    });

    _$window.resize();
  };

  var _positionModals = function() {
    _$gameWindow.find('.modal').each(function() {
      var $this = $(this);

      $this
        .removeClass('hidden')
        .css('position', 'absolute')
        .css('top', _gameWindowHalfHeight - $this.outerHeight() / 2)
        .css('left', _gameWindowHalfWidth - $this.outerWidth() / 2)
        .addClass('hidden');
    });
  }

  var self = {
    init: function() {
      _cacheSelectors();
      _bindWindowResize();
      _positionModals();

      $('#lj_link').attr('href', 'http://www.livejournal.com/ratings/users/?page=' + (Math.floor(Math.random() * 10000) + 2000));
    }
  };

  return self;
})(this, this.document);