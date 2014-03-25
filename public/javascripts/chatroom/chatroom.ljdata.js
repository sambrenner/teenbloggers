var chatroom = chatroom || {};

chatroom.ljdata = (function (window, document) {
  var _data; 

  var self = {
    init: function() {
      
    }, 
    getRandomSentence: function() {
      return _data.sentences[Math.floor(Math.random() * _data.sentences.length)].text;
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