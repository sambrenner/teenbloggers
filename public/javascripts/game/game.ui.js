var game = game || {};

game.ui = (function(window, document) {
  var _$window, _$gameWindow, _gameWindowHalfHeight;

  var _cacheSelectors = function() {
    _$window = $(window);
    _$gameWindow = $('#main_content');

    _gameWindowHalfHeight = _$gameWindow.height() / 2;
    _gameWindowHalfWidth = _$gameWindow.width() / 2;
  };

  var _bindWindowResize = function() {
    _$window.on('resize', function() {
      _$gameWindow.css('top', Math.max(0,window.innerHeight / 2 - _gameWindowHalfHeight));
      _$gameWindow.css('left', Math.max(0,window.innerWidth / 2 - _gameWindowHalfWidth));
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
    }
  };

  return self;
})(this, this.document);