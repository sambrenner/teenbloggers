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
  var stripper = require('htmlstrip-native');
  var xml2js = require('xml2js');
  var parser = new xml2js.Parser();
  var username = req.params.username;

  request('http://' + username + '.livejournal.com/data/rss', function(e, r, b) {
    if (!e && r.statusCode == 200) {
      parser.parseString(b, function(e, r) {
        var items = r.rss.channel[0].item;
        var corpus = '';
        
        for(var i=0; i<items.length; i++) {
          var item = items[i];
          var stripOptions = {
            include_script: false,
            include_style: false,
            compact_whitespace: true
          };

          var processedText = stripper.html_strip(item.description[0], stripOptions);

          corpus += (processedText + ' ');
        }

        var ljInfo = {};
        ljInfo.username = username;
        ljInfo.corpus = corpus;

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(ljInfo));
      });
    }
  });
};