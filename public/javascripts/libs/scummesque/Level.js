var Scummesque = Scummesque || {};

Scummesque.Level = function(options) {
  for (var o in options) { this[o] = options[o]; }

  if(!this.container) this.container = new createjs.Container();
  
  if(this.slideable === undefined) this.slideable = false;
  if(this.transitionIn === undefined) this.transitionIn = true;
  if(this.transitionOut === undefined) this.transitionOut = true;

  this.inited = false;
  this.active = false;
};

Scummesque.Level.prototype.init = function() {
  if(!this.inited) {
    this.addEvents();

    if(this.backgroundUrl) {
      this.background = this.container.addChild(new createjs.Bitmap(this.backgroundUrl));
    }

    if(this.interactables) {
      for(var i=0; i<this.interactables.length; i++) {
        var interactable = this.interactables[i];
        interactable.init();

        this.container.addChild(interactable.container);
      }
    }

    if(this.actor) {
      this.container.addChild(this.actor.container);
      this.initActor();
    }

    this.inited = true;
  }
};

Scummesque.Level.prototype.initActor = function() {
  var level = this;
  var actor = this.actor;

  $(window).trigger('show_console');

  actor.container.y = 340;
  actor.container.x = -68;

  var container = level.background ? level.background : level.container;
  container.addEventListener('click', function(e) {
    $(window).trigger('level_click');

    actor.walkTo({x: e.localX}, 80, function() {
      if(level.slideable) level.checkContainerSlide(e.localX);
    });
  });
}

Scummesque.Level.prototype.addEvents = function() {
  var $window = $(window);
  var level = this;

  $window.on('interactable_click', function(e) {
    if(!level.active) return;

    if(level.actor) {
      var objCoords = e.mouseEvent.currentTarget.localToGlobal(e.mouseEvent.localX, e.mouseEvent.localY);
      objCoords = level.background.globalToLocal(objCoords.x, objCoords.y);
      level.actor.walkToAndTurn({x: objCoords.x}, 80, function() {
        if(level.slideable) level.checkContainerSlide(level.actor.container.x);
        e.onFocus();
      });
    }

    //e.stopImmediatePropagation();
  });
};

Scummesque.Level.prototype.checkContainerSlide = function(actorX) {
  if(actorX > 580) this.shiftTo(-296);
  else if(actorX < 360) this.shiftTo(0);
}

Scummesque.Level.prototype.shiftTo = function(x, onComplete) {
  createjs.Tween.get(this.container).to({x: x}, 1000, createjs.Ease.quadInOut).call(function() {
    if(onComplete) onComplete();
  });
}

Scummesque.Level.prototype.hideDomElement = function() {
  if(this.domElementOverlay) this.domElementOverlay.addClass('hidden');
}