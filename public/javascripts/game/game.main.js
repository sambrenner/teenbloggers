var game = game || {};

game.main = (function(window, document) {
  var _scummesque, _levels;

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
        transitionIn: false,
        enter: function() {
          //_scummesque.setActiveLevel(0);

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
                game.sockets.connect(function() {
                  game.sockets.selectUser(game.ljdata.data.username);  
                  _scummesque.transitionToLevel(1);
                });
              }, function(e) {
                if(e == 'posts_error')
                  $characterError.removeClass('hidden').text('This user has no public posts. How wise! Please choose another.');
                else
                  $characterError.removeClass('hidden').text('Username invalid, please enter an extant LiveJournal username!');
              });
            }
          });
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
            position: {x: 480, y: 141},
            onFocus: function() {
              // zoom in on couple
              _scummesque.transitionToLevel(2);
            }
          })
        ],
        enteredOnce: false,
        enter: function() {
          _scummesque.setActiveLevel(1);

          if(!this.enteredOnce) {
            this.enteredOnce = true;
            var actor = this.actor;
            createjs.Tween.get(actor.container).to({x: 60}, 2000).call(function() {
              actor.sprite.gotoAndPlay('standSide');
            });
          }
        }
      }),

      //LEVEL 2: Flirting Couple
      new Scummesque.Level({
        backgroundUrl: '/images/game/flirtingcouple.gif',
        domElementOverlay: $('#couple'),
        enter: function() {
          _scummesque.setActiveLevel(2);

          var $call = this.domElementOverlay.find('.call');
          var $response = this.domElementOverlay.find('.response');
          this.domElementOverlay.removeClass('hidden');

          var coupleResponses = [
            'Huh?',
            'What are you talking about?',
            'Get lost.',
            'I don\'t understand you.',
            'Uhh... what?'
          ];

          $window.trigger({
            type: 'display_console_choices',
            choices: game.ljdata.getRandomSentences(4),
            choiceClickHandler: function(choice) {
              $call.empty().text(choice).removeClass('hidden');

              setTimeout(function() {
                $call.addClass('hidden');
                $response.empty().text(coupleResponses[Math.floor(Math.random() * coupleResponses.length)]).removeClass('hidden');

                setTimeout(function() {
                  $response.addClass('hidden');
                }, 3000);
              }, 3000);

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
        interactables: [
          new Scummesque.Interactable({
            action: 'Use',
            name: 'Computer',
            imageUrl: '/images/game/computerscreen.gif',
            position: {x: 68, y: 180},
            onFocus: function() {
              // go to next level
              _scummesque.transitionToLevel(4);
            }
          }),
          new Scummesque.Interactable({
            action: 'Use',
            name: 'Computer',
            imageUrl: '/images/game/computerscreen.gif',
            position: {x: 173, y: 180},
            onFocus: function() {
              // go to next level
              _scummesque.transitionToLevel(4);
            }
          }),
          new Scummesque.Interactable({
            action: 'Use',
            name: 'Computer',
            imageUrl: '/images/game/computerscreen.gif',
            position: {x: 301, y: 180},
            onFocus: function() {
              // go to next level
              _scummesque.transitionToLevel(4);
            }
          }),
          new Scummesque.Interactable({
            action: 'Use',
            name: 'Computer',
            imageUrl: '/images/game/computerscreen.gif',
            position: {x: 406, y: 180},
            onFocus: function() {
              // go to next level
              _scummesque.transitionToLevel(4);
            }
          }),
          new Scummesque.Interactable({
            action: 'Look at',
            name: 'Poster',
            imageUrl: '/images/game/poster.gif',
            position: {x: 517, y: 90},
            onFocus: function() {
              $window.trigger({
                type: 'display_console_text',
                text: 'Woah! Sick breaker!',
                constant: true
              });
            }
          }),
        ],
        enteredOnce: false,
        enter: function() {
          _scummesque.setActiveLevel(3);

          if(!this.enteredOnce) {
            this.enteredOnce = true;
            var actor = this.actor;
            createjs.Tween.get(actor.container).to({x: 60}, 2000).call(function() {
              actor.sprite.gotoAndPlay('standSide');
            });
          }
        }
      }),

      //LEVEL 4: Chatroom
      new Scummesque.Level({
        backgroundUrl: '/images/game/computerbg.gif',
        domElementOverlay: $('#chatroom'),
        enter: function() {
          _scummesque.setActiveLevel(4);

          this.domElementOverlay.removeClass('hidden');
          
          $(window).trigger('hide_console');

          //offload functionality to game.chatroom.js
          game.chatroom.init();

          game.sockets.enterChatroom();
        }
      })
    ];
  };

  var _beginTransition = function(thisGame, transitionOut, transitionIn) {
    //begin ramping of uniform
    var uniform = {};
    uniform.val = 400;

    var firstChange = false;

    createjs.Tween.get(uniform).to({val: 1}, transitionOut ? 1000 : 0).on('change', function(e) {
      if(transitionOut) {
        game.threejs.setMosaicValue(uniform.val);
        game.threejs.render();
      }

      //check first iteration
      if(!firstChange) {
        //tell game to start with next level
        thisGame.continueTransition();

        firstChange = true;
      }

      //check done
      if(uniform.val == 1) {
        game.threejs.updateTexture(function() {
          _finishTransition(transitionIn);
        });
      }
    });
  };

  var _finishTransition = function(transitionIn) {
    //begin reverse ramping of uniform
    var uniform = {};
    uniform.val = 1;

    createjs.Tween.get(uniform).to({val: 400}, transitionIn ? 1000 : 0).on('change', function(e) {  
      if(transitionIn) {
        game.threejs.setMosaicValue(uniform.val);
        game.threejs.render();
      }

      if(uniform.val == 400) {
        //transition done
        game.threejs.postTransition();
        _scummesque.enterLevel();
      }
    });
  };

  var self = {
    init: function() {
      game.ui.init();
      game.threejs.init(document.getElementById('game_canvas'));
      
      _levels = _makeLevels();

      _scummesque = new Scummesque.Game({
        canvasId: 'game_canvas',
        levels: _levels,
        console: new Scummesque.Console({
          domElement: $('#console'),
          defaultText: 'Walk to'
        }),
        autoStart: true,
        transitionAnimation: function(transitionOut, transitionIn) {
          var thisGame = this;

          game.threejs.prepareForTransition();
          game.threejs.updateTexture(function() {
            _beginTransition(thisGame, transitionOut, transitionIn);
          });
        }
      });
    }
  };

  return self;
})(this, this.document);