var dbUrl = 'localhost:27017';
var collections = ['livejournals'];
var db = require('mongojs').connect(dbUrl, collections);

var getLJCorpus = function(username, callback) {
  var request = require('request');
  var stripper = require('htmlstrip-native');
  var xml2js = require('xml2js');
  var parser = new xml2js.Parser();

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

        callback(ljInfo);
      });
    }
  });
};

var extractQuestions = function(corpus) {
  var questions = corpus.match(/[^.!?"]+\?/g);

  for (var i = 0; i < questions.length; i++) {
    questions[i] = questions[i].trim() + '?';
  };

  return questions;
};

var extractSelfReferences = function(corpus) {
  var sentences = extractSentences(corpus);
  var selfReferences = [];
  
  for (var i = 0; i < sentences.length; i++) {
    var sentence = sentences[i];
    if(sentence.match(/\b[Ii]\b/)) selfReferences.push(sentence)
  };

  return selfReferences;
};

var extractSentences = function(corpus) {
  return corpus.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g);
};

exports.pos = function(req, res){
  var pos = require('pos');
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
  var username = req.params.username;

  db.livejournals.find({username: username}, function(err, livejournal) {
    if(err||livejournal.length == 0) {
      console.log('livejournal not found. getting and saving')

      getLJCorpus(req.params.username, function(data) {
        data.questions = extractQuestions(data.corpus);
        data.selfReferences = extractSelfReferences(data.corpus);
        data.sentences = extractSentences(data.corpus);

        db.livejournals.save(data, function(err, saved) {
          data.status = 'saved';
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(data));
        });
      });
    } else {
      livejournal = livejournal[0]

      livejournal.status = 'found';
      console.log('found in db: ' + livejournal);

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(livejournal));
    }
  });
};

exports.searchLJ

//sentences ending with a question mark
exports.loadLJQuestions = function(req, res) {
  getLJCorpus(req.params.username, function(data) {
    data.questions = extractQuestions(data.corpus);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  });
};

//sentences containing the word I (or I'll, I'm etc)
exports.loadLJSelfReferences = function(req, res) {
  getLJCorpus(req.params.username, function(data) {
    data.selfReferences = extractSelfReferences(data.corpus);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  });
};

//all sentences
exports.loadLJSentences = function(req, res) {
  getLJCorpus(req.params.username, function(data) {
    data.sentences = extractSentences(data.corpus);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  });
};