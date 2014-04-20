var Scummesque = Scummesque || {};

Scummesque.Game = function(options) {
  if(!createjs) console.error('Scummesque requires CreateJS');
  if(!jQuery && !$) console.error('Scummesque requires jQuery');

  for (var o in options) { this[o] = options[o]; }

  if(!this.canvasId) console.error('Game requires Canvas');
  if(!this.levels) console.error('Game requires Levels');

  this.stage = new createjs.Stage(this.canvasId);
  this.stage.enableMouseOver(4);

  this.addEvents();

  if(this.autoStart) this.start();
};

Scummesque.Game.prototype.addEvents = function() {
  var game = this;
  var $window = $(window);

  $window.on('show_console', function() {
    game.console.show();
  });

  $window.on('display_console_text', function(e) {
    game.console.displayText(e.text);
  });

  $window.on('hide_console_text', function(e) {
    game.console.displayText('');
  });
}

Scummesque.Game.prototype.currentLevel = null;
Scummesque.Game.prototype.nextLevel = null;

Scummesque.Game.prototype.transitionToLevel = function(level) {
  this.nextLevel = this.levels[level];

  if(this.currentLevel) this.stage.removeChild(this.currentLevel.container);

  this.nextLevel.init();
  this.stage.addChild(this.nextLevel.container);

  this.currentLevel = this.nextLevel;
};

Scummesque.Game.prototype.start = function() {
  createjs.Ticker.addEventListener('tick', this.stage);

  this.transitionToLevel(0);
};

Scummesque.Game.prototype.animate = function() {
  this.stage.update();
}