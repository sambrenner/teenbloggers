var Scummesque = Scummesque || {};

Scummesque.Console = function(options) {
  for (var o in options) { this[o] = options[o]; }

  if(!this.domElement) console.error('Consoles require DOM Elements');
  if(!this.constantText) this.constantText = '';
};

Scummesque.Console.prototype.show = function() {
  this.domElement.removeClass('hidden');
};

Scummesque.Console.prototype.hide = function() {
  this.domElement.addClass('hidden');
};

Scummesque.Console.prototype.displayText = function(text, constant) {
  if(constant) this.constantText = text;
  this.domElement.empty().append('<p>' + text + '</p>');
};

Scummesque.Console.prototype.clearText = function(clearConstant) {
  if(clearConstant) this.constantText = '';
  this.domElement.empty().append('<p>' + this.constantText + '</p>');
}

Scummesque.Console.prototype.displayChoiceOptions = function(choices) {

};