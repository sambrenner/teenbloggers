var Scummesque = Scummesque || {};

Scummesque.Interactable = function(options) {
  for (var o in options) { this[o] = options[o]; }

  if(!this.container) this.container = new createjs.Container();
};
