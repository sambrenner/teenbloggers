var Scummesque = Scummesque || {};

Scummesque.Level = function(options) {
  for (var o in options) { this[o] = options[o]; }

  if(!this.container) this.container = new createjs.Container();
};

Scummesque.Level.prototype.init = function() {
  if(this.backgroundUrl) {
    this.container.addChild(new createjs.Bitmap(this.backgroundUrl));
  }

  if(this.interactables) {
    for(var i=0; i<this.interactables.length; i++) {
      var interactable = this.interactables[i];

      this.container.addChild(interactable.container);
    }
  }

  if(this.actor) {
    this.container.addChild(this.actor.container);
  }

  if(this.enter) this.enter();
};