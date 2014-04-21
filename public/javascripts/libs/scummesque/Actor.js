var Scummesque = Scummesque || {};

Scummesque.Actor = function(options) {
  for (var o in options) { this[o] = options[o]; }

  if(!this.spritesheetUrl) console.error('Actors need Spritesheets');
  if(!this.spriteAnimations) console.error('Actors need Animation Guides');
  if(!this.spriteFrames) console.error('Actors need Sprite Frame Guides');
  if(!this.defaultAnimation) console.error('Actors need Default Animations');
  if(!this.container) this.container = new createjs.Container();

  var data = {
    framerate: 10,
    images: [this.spritesheetUrl],
    animations: this.spriteAnimations,
    frames: this.spriteFrames
  }

   this.spritesheet = new createjs.SpriteSheet(data);
   this.sprite = new createjs.Sprite(this.spritesheet, this.defaultAnimation);

   this.container.addChild(this.sprite);
};

Scummesque.Actor.prototype.walkTo = function(position, speed, onArrive) {
  var actor = this;

  this.sprite.gotoAndPlay('walk');
     
  var fromX, toX, fromY, toY;
  fromX = toX = this.container.x;
  fromY = toY = this.container.y;

  if(position.x) toX = position.x;
  if(position.y) toY = position.y;

  if(toX < fromX)
    this.sprite.setTransform(0,0,-1);
  else
    this.sprite.setTransform(0,0,1);

  var distance = Scummesque.Utils.distance(fromX, fromY, toX, toY);
  var time = Scummesque.Utils.distanceToTime(distance, speed);

  createjs.Tween.get(this.container).to({x: toX, y: toY}, time).call(function() {
    actor.sprite.gotoAndPlay('standSide');
    if(onArrive) onArrive();
  });
};

Scummesque.Actor.prototype.walkToAndTurn = function(position, speed, onArrive) {
  actor = this;

  this.walkTo(position, speed, function() {
    actor.sprite.gotoAndPlay('turn');

    if(onArrive) setTimeout(onArrive, 750); // pause for turn animation
  });
}