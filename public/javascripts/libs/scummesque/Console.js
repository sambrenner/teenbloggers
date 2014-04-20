var Scummesque = Scummesque || {};

Scummesque.Console = function(options) {
  for (var o in options) { this[o] = options[o]; }

  if(!this.domElement) console.error('Consoles require DOM Elements');
};

Scummesque.Console.prototype.show = function() {
  this.domElement.removeClass('hidden');
};

Scummesque.Console.prototype.hide = function() {
  this.domElement.addClass('hidden');
};

Scummesque.Console.prototype.displayText = function(text) {
  this.domElement.empty().append('<p>' + text + '</p>');
};

Scummesque.Console.prototype.displayChoiceOptions = function(choices) {

};