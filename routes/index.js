var dbUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost:27017';
var collections = ['livejournals'];
var db = require('mongojs').connect(dbUrl, collections);
var validator = require('validator');

var _loadJournalCorpus = function(username, callback) {
  var request = require('request');
  var stripper = require('htmlstrip-native');
  var xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  request('http://' + encodeURIComponent(username) + '.livejournal.com/data/rss', function(e, r, b) {
    if (!e) {
      if(r.statusCode == 200) {
        parser.parseString(b, function(e, r) {
          var items = r.rss.channel[0].item;
          var corpus = '';
          
          if(!items) {
            callback(null, 'posts_error');
            return;
          }

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

          var JournalsInfo = {};
          JournalsInfo.username = username;
          JournalsInfo.corpus = corpus;

          callback(JournalsInfo);
        });
      } else {
        callback(null, r.statusCode);
      }
    } else {
      callback(null, 'server_error');
    }
  });
};

var _extractQuestions = function(corpus) {
  var questions = corpus.match(/[^.!?"]+\?/g);

  if(!questions) return [];

  for (var i = 0; i < questions.length; i++) {
    questions[i] = { text: questions[i].trim() + '?'};
  };

  return questions;
};

var _extractSelfReferences = function(corpus) {
  var sentences = _extractSentences(corpus);
  var selfReferences = [];
  
  for (var i = 0; i < sentences.length; i++) {
    var sentence = sentences[i].text;
    if(sentence.match(/\b[Ii]\b/)) selfReferences.push( { text: sentence });
  };

  return selfReferences;
};

var _extractSentences = function(corpus) {
  var sentences = corpus.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g);

  for(var i=0; i<sentences.length; i++) {
    sentences[i] = { text: sentences[i] };
  }

  return sentences;
};

var _getJournal = function(username, select, success, failure) {
  db.livejournals.findAndModify({
      'query': {'username': username },
      'update': {'$set': {'available': !select}},
      'new': true
    }, function(err, livejournal) {
    if(err||!livejournal) {
      console.log('livejournal ' + username + ' not found. getting and saving')

      _loadJournalCorpus(username, function(livejournal, error) {
        if(!error) {
          livejournal.questions = _extractQuestions(livejournal.corpus);
          livejournal.selfReferences = _extractSelfReferences(livejournal.corpus);
          livejournal.sentences = _extractSentences(livejournal.corpus);
          livejournal.available = !select;

          db.livejournals.save(livejournal, function(err, saved) {
            livejournal.status = 'saved';
            success(livejournal);
          });
        } else {
          failure(error);
        }
      });
    } else {
      livejournal.status = 'found';
      success(livejournal);
    }
  });
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

exports.getJournal = function(req, res) {
  _getJournal(req.params.username, false, function(data) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  }, function(error) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: error}));
  });
};

exports.searchJournals = function(req, res) {
  //hello shep!
  res.setHeader("Access-Control-Allow-Origin", "http://shep.info");
  res.setHeader("Content-Type", "application/json");

  var searchRegex = new RegExp('\\b' + validator.escape(req.params.term) + '\\b', 'i');

  db.livejournals.find({ 'sentences': { '$elemMatch': { text: searchRegex } } }, { 'username': 1, 'sentences.text': 1 }, function(err, data) {
    if(data.length > 0) {
      //randomly select user
      var speaker = data[Math.floor(Math.random() * data.length)];
      
      //find matching sentences
      var matchingSentences = [];
      for (var i = 0; i < speaker.sentences.length; i++) {
        if(speaker.sentences[i].text.match(searchRegex)) matchingSentences.push(speaker.sentences[i]);
      }

      //randomly pick one of those
      var sentence = matchingSentences[Math.floor(Math.random() * matchingSentences.length)];

      //return it
      res.end('{ "username":"' + escape(speaker.username) + '", "sentence":"' + escape(sentence.text) + '"}');
    } else {
      res.end({ error: 1 });
    }
  });
};

exports.selectJournal = function(req, res) {
  _getJournal(validator.escape(req.params.username), true, function(data) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  }, function(error) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: error}));
  });
};

exports.deselectJournal = function(username, callback) {
  db.livejournals.update({
    'username': validator.escape(username)
  }, {
    '$set': { 'available': true }
  }, function() {
    if(callback) callback('{"success":true}');
  });
};

exports.deselectJournalWeb = function(req, res) {
  deselectJournal(validator.escape(req.params.username), function(data) {
    res.send(data);
  });
};

exports.getAvailableJournals = function(req, res) {
  db.livejournals.find({
    '$or': [
      { 'available': true },
      { 'available': null }
    ]
  }, {
    'username': 1
  }, function(err, data) {
    res.send(data);
  });
};

exports.resetAvailableJournals = function(req, res) {
  db.livejournals.update({
    '$or': [
      { 'available': false },
      { 'available': null }
    ]
  }, {
    '$set': { 'available': true }
  }, {
    'multi': true
  }, function() {
    res.send('{"success":true}');
  });
};
