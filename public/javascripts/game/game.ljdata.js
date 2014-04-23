var game = game || {};

game.ljdata = (function (window, document) {
  var _data;

  var self = {
    init: function() {
      
    }, 
    getRandomSentence: function() {
      return _data.sentences[Math.floor(Math.random() * _data.sentences.length)].text;
    },
    getRandomSentences: function(numSentences) {
      var sentences = [];
      
      for (var i = 0; i < numSentences; i++) {
        sentences.push(self.getRandomSentence());
      };

      return sentences;
    },
    set data(data) {
      _data = data;
    },
    get data() {
      return _data;
    }
  }; 

  return self;
})(this, this.document);