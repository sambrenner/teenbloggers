var pos = require('pos');

exports.pos = function(req, res){
  var input = req.params.text;

  var words = new pos.Lexer().lex(input);
  var taggedWords = new pos.Tagger().tag(words);

  var data = {
    input: req.params.text,
    tagged: taggedWords
  };

  res.set('Content-Type', 'application/json');
  res.send(data);
};