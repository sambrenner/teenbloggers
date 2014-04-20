var game = game || {};

game.main = (function(window, document) {
  var _scummesque;

  var _makeLevels = function() {
    return [
      new Scummesque.Level({
        backgroundUrl: '/images/game/establishingshot.gif',
        domElementOverlay: $('#intro'),
        enter: function() {
          var $welcomeSection = $('#welcome');
          var $characterSelectSection = $('#character_select');
          var $beginBtn = $('#begin');
          var level = this;

          $welcomeSection.removeClass('hidden');

          $beginBtn.on('click', function(e) {
            e.preventDefault();

            $welcomeSection.addClass('hidden');
            $characterSelectSection.removeClass('hidden');
          });

          $characterSelectSection.find('form').on('submit', function(e) {
            e.preventDefault();
            level.exit();
          });
        },
        exit: function() {
          this.domElementOverlay.addClass('hidden');
          
          _scummesque.transitionToLevel(1);
        }
      }),
      new Scummesque.Level({
        backgroundUrl: '/images/game/hallway.gif'
      })
    ];
  };

  var _animate = function() {
    window.requestAnimationFrame(_animate);
    _scummesque.animate();
  };

  var self = {
    init: function() {
      game.ui.init();

      _scummesque = new Scummesque.Game({
        canvasId: 'game_canvas',
        levels: _makeLevels(),
        autoStart: true
      });

      _animate();
    }
  };

  return self;
})(this, this.document);