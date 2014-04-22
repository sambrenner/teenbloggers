var game = game || {};

game.main = (function(window, document) {
  var _scummesque;

  var _makeActor = function() {
    return new Scummesque.Actor({
      spritesheetUrl: '/images/game/walkcycle.png',
      spriteAnimations: {
        walk: [0,8],
        turn: [9,10,'standAway'],
        standSide: [11],
        standAway: [10]
      },
      spriteFrames: {
        width: 68,
        height: 156,
        regX: 34,
        regY: 156
      },
      defaultAnimation: 'walk'
    });
  };

  var _makeLevels = function() {
    var $window = $(window);

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

          game.userselect.init();
          game.userselect.seedUsernames();

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
        actor: _makeActor(),
        interactables: [
          new Scummesque.Interactable({
            action: 'Look at',
            name: 'Trophy Cabinet',
            imageUrl: '/images/game/trophycabinet.gif',
            position: {x: 269, y: 116},
            onFocus: function() {
              $window.trigger({
                type: 'display_console_text',
                text: 'This one trophy has a bunch of LEDs in it. I wonder who made that?',
                constant: true
              });
            }
          }),
          new Scummesque.Interactable({
            action: 'Open',
            name: 'Computer Lab Door',
            imageUrl: '/images/game/labdoor.gif',
            position: {x: 693, y: 116},
            onFocus: function() {
              // go to next level
              _scummesque.transitionToLevel(2);
            }
          }),
          new Scummesque.Interactable({
            action: 'Talk to',
            name: 'Flirting Couple',
            imageUrl: '/images/game/people.gif',
            position: {x: 504, y: 141},
            onFocus: function() {
              // zoom in on couple
            }
          })
        ],
        enter: function() {
          
        }
      }),
      
      //Computer Lab
      new Scummesque.Level({
        backgroundUrl: '/images/game/complab.gif',
        actor: _makeActor(),
        enter: function() {
          
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
        console: new Scummesque.Console({
          domElement: $('#console')
        }),
        autoStart: true
      });
    }
  };

  return self;
})(this, this.document);