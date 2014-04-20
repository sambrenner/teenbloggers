var Scummesque = Scummesque || {};

Scummesque.Game = function(options) {
  if(!createjs) console.error('Scummesque requires CreateJS');
  if(!jQuery && !$) console.error('Scummesque requires jQuery');

  for (var o in options) { this[o] = options[o]; }

  if(!this.canvasId) console.error('Game requires Canvas');
  if(!this.levels) console.error('Game requires Levels');

  this.stage = new createjs.Stage(this.canvasId);

  if(this.autoStart) this.start();
};

Scummesque.Game.prototype.currentLevel = null;
Scummesque.Game.prototype.nextLevel = null;

Scummesque.Game.prototype.transitionToLevel = function(level) {
  this.nextLevel = this.levels[level];

  this.nextLevel.init();
  this.stage.addChild(this.nextLevel.container);
};

Scummesque.Game.prototype.start = function() {
  this.animate();
  this.transitionToLevel(0);
};

Scummesque.Game.prototype.animate = function() {
  this.stage.update();
}