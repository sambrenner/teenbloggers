var game = game || {};

game.main = (function(window, document) {
  var _scummesque;

  var _makeLevels = function() {
    return [

      //Intro Screen
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

      //Hallway
      new Scummesque.Level({
        backgroundUrl: '/images/game/hallway.gif',
        actor: new Scummesque.Actor({
          spritesheetUrl: '/images/game/walkcycle.png',
          spriteAnimations: {
            walk: [0,8],
            turn: [9,10],
            stand: [11]
          },
          spriteFrames: {
            width: 68,
            height: 156
          },
          defaultAnimation: 'walk'
        }),
        enter: function() {
          var actor = this.actor;
          actor.container.y = 185;
          actor.container.x = -68;

          createjs.Tween.get(actor.container).to({x: 60}, 2000).call(function() {
            actor.sprite.gotoAndPlay('stand');
          });

          var container = this.container;
          container.addEventListener('click', function(e) {
            actor.sprite.gotoAndPlay('walk');
            createjs.Tween.get(actor.container).to({x: e.stageX}, 2000).call(function() {
              actor.sprite.gotoAndPlay('stand');
            });
          });
        }
      })
    ];
  };

  var self = {
    init: function() {
      game.ui.init();

      _scummesque = new Scummesque.Game({
        canvasId: 'game_canvas',
        levels: _makeLevels(),
        autoStart: true
      });
    }
  };

  return self;
})(this, this.document);