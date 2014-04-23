var Scummesque = Scummesque || {};

Scummesque.Console = function(options) {
  for (var o in options) { this[o] = options[o]; }

  if(!this.domElement) console.error('Consoles require DOM Elements');
  if(!this.constantText) this.constantText = '';
  if(!this.lock) this.lock = false;
};

Scummesque.Console.prototype.show = function() {
  this.domElement.removeClass('hidden');
};

Scummesque.Console.prototype.hide = function() {
  this.domElement.addClass('hidden');
};

Scummesque.Console.prototype.displayText = function(text, constant) {
  if(this.lock) return;
  if(constant) this.constantText = text;
  this.domElement.empty().append('<p>' + text + '</p>');
};

Scummesque.Console.prototype.clearText = function(clearConstant) {
  if(this.lock) return;
  if(clearConstant) this.constantText = '';
  this.domElement.empty().append('<p>' + this.constantText + '</p>');
}

Scummesque.Console.prototype.displayChoiceOptions = function(choices, choiceClickHandler, exitHandler) {
  var $list = $('<ul></ul>');

  for (var i = 0; i < choices.length; i++) {
    var $choice = $('<li><a>' + choices[i] + '</a></li>').on('click', choiceClickHandler);
    $list.append($choice);
  };

  if(exitHandler) {
    var $exitBtn = $('<li><a>Uhhh, I\'m leaving. Goodbye.</a></li>').on('click', exitHandler);
    $list.append($exitBtn)
  }

  this.domElement.empty().append($list);
};