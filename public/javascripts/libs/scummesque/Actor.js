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
