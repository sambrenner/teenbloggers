var Scummesque = Scummesque || {};

Scummesque.Interactable = function(options) {
  for (var o in options) { this[o] = options[o]; }

  if(!this.name) console.error('Interactables need names');
  if(!this.action) console.error('Interactables need actions');
  if(!this.imageUrl) console.error('Interactables need images');
  if(!this.onFocus) console.error('Interactables need focus instructions');
  if(!this.container) this.container = new createjs.Container();
};

Scummesque.Interactable.prototype.init = function() {
  this.container.addChild(new createjs.Bitmap(this.imageUrl));
  this.container.x = this.position.x;
  this.container.y = this.position.y;

  this.addEvents();
};

Scummesque.Interactable.prototype.addEvents = function() {
  var $window = $(window);
  var interactable = this;

  this.container.addEventListener('mouseover', function() {
    $window.trigger({
      type: 'display_console_text',
      text: interactable.action + ' ' + interactable.name
    });
  });

  this.container.addEventListener('mouseout', function() {
    $window.trigger('hide_console_text');
  });

  this.container.addEventListener('click', function(e) {
    $window.trigger({
      type:'interactable_click',
      mouseEvent: e,
      onFocus: interactable.onFocus
    });
  });
}
