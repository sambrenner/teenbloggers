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

      //LEVEL 0: Intro Screen
      new Scummesque.Level({
        backgroundUrl: '/images/game/establishingshot.gif',
        domElementOverlay: $('#intro'),
        enter: function() {
          var $welcomeSection = $('#welcome');
          var $characterSelectSection = $('#character_select');
          var $beginBtn = $('#begin');
          var $characterError = $('#character_error');

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

            $characterError.addClass('hidden').text('');
            
            var username = game.userselect.getComboboxValue();
            if(username == '') {
              $characterError.removeClass('hidden').text('Please enter a username.');
            }
            else {
              game.userselect.loadUser(username, function() {
                level.exit();
              }, function() {
                $characterError.removeClass('hidden').text('Username invalid, please enter an active LiveJournal username!');
              });
            }
          });
        },
        exit: function() {
          this.domElementOverlay.addClass('hidden');

          _scummesque.transitionToLevel(1);
        }
      }),

      //LEVEL 1: Hallway
      new Scummesque.Level({
        backgroundUrl: '/images/game/hallway.gif',
        slideable: true,
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
                text: 'First place in the synchronized swimming regionals. Cool, I guess. This other trophy has LEDs in it, I wonder where that came from?',
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
              _scummesque.transitionToLevel(3);
            }
          }),
          new Scummesque.Interactable({
            action: 'Talk to',
            name: 'Flirting Couple',
            imageUrl: '/images/game/people.gif',
            position: {x: 504, y: 141},
            onFocus: function() {
              // zoom in on couple
              _scummesque.transitionToLevel(2);
            }
          })
        ],
        enter: function() {
          
        }
      }),

      //LEVEL 2: Flirting Couple
      new Scummesque.Level({
        backgroundUrl: '/images/game/flirtingcouple.gif',
        enter: function() {
          $window.trigger({
            type: 'display_console_choices',
            choices: game.ljdata.getRandomSentences(4),
            choiceClickHandler: function() {
              console.log('choice click');
            },
            exitHandler: function() {
              $window.trigger('unlock_console');
              $window.trigger('reset_console_height');
              _scummesque.transitionToLevel(1);
            }
          });
        }
      }),
      
      //LEVEL 3: Computer Lab
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
      game.sockets.init();

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