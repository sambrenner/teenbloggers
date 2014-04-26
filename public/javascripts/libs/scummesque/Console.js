var Scummesque = Scummesque || {};

Scummesque.Console = function(options) {
  for (var o in options) { this[o] = options[o]; }

  if(!this.domElement) console.error('Consoles require DOM Elements');
  if(!this.constantText) this.constantText = '';
  if(!this.defaultText) this.defaultText = '';
  if(!this.lock) this.lock = false;

  this.defaultHeight = this.domElement.height();
  this.clearText();
};

Scummesque.Console.prototype.show = function() {
  this.domElement.removeClass('hidden');
};

Scummesque.Console.prototype.hide = function() {
  this.domElement.addClass('hidden');
};

Scummesque.Console.prototype.resetHeight = function() {
  this.domElement.css('height', this.defaultHeight);
}

Scummesque.Console.prototype.displayText = function(text, constant) {
  if(this.lock) return;
  if(constant) this.constantText = text;
  this.domElement.empty().append('<p>' + text + '</p>');
};

Scummesque.Console.prototype.clearText = function(clearConstant) {
  if(this.lock) return;
  if(clearConstant) this.constantText = '';

  this.domElement.empty().append('<p>' + ((this.constantText == '') ? this.defaultText : this.constantText) + '</p>');
}

Scummesque.Console.prototype.displayChoiceOptions = function(choices, choiceClickHandler, exitHandler) {
  var $list = $('<ul></ul>');

  for (var i = 0; i < choices.length; i++) {
    var choice = choices[i];

    var $choice = $('<li><a>' + choice + '</a></li>').on('click', function() {
      choiceClickHandler($(this).find('a').text());
    });
    $list.append($choice);
  };

  if(exitHandler) {
    var $exitBtn = $('<li><a>Uhhh, I\'m leaving. Goodbye.</a></li>').on('click', exitHandler);
    $list.append($exitBtn)
  }

  this.domElement.empty().append($list).css('height', $list.height());
};