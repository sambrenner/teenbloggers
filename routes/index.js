var pos = require('pos');

exports.pos = function(req, res){
  var input = req.params.text;

  var words = new pos.Lexer().lex(input);
  var taggedWords = new pos.Tagger().tag(words);

  var data = {
    input: req.params.text,
    tagged: taggedWords
  };

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(data));
};

exports.loadLJ = function(req, res) {
  var request = require('request');
  var xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  request('http://' + req.params.username + '.livejournal.com/data/rss', function(e, r, b) {
    if (!e && r.statusCode == 200) {
      parser.parseString(b, function(e, r) {
        var items = r.rss.channel[0].item;
        for(var i=0; i<items.length; i++) {
          var item = items[i];
          console.log(item.description[0]);
        }
      });
    }
  });
};