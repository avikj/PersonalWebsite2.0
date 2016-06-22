var Project = require('./models/project');
var Position = require('./models/position');
var Skill = require('./models/skill');
var modelMap = require('./modelMap');
var reloadData = require('./reloadData');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var router = express.Router();

app.set('json spaces', 2);

mongoose.connect('mongodb://localhost/avik', reloadData);

router.get('/search', function(req, res){
  var queryPromises = [
    /*Project.find({$or: [{name: req.query.q}, {technologies: req.query.q}]}).exec(),
    Position.find({$or: [{name: req.query.q, keywords: req.query.q}]}).exec(),
    Skill.find({name: req.query.q}).exec()*/
    Project.find({
      $text: {
        $search: req.query.q
      }
    }, {
      score: {
        $meta: 'textScore'
      }
    }).sort({
      score: {
        $meta: 'textScore'
      }
    }).exec(),

    Position.find({
      $text: {
        $search: req.query.q
      }
    }, {
      score: {
        $meta: 'textScore'
      }
    }).sort({
      score: {
        $meta: 'textScore'
      }
    }).exec(),
    // Position.find({$text: {$search: req.query.q}}).exec(),
    // Skill.find({$text: {$search: req.query.q}}).exec()
  ];
  Promise.all(queryPromises).then(function(searchResults) {
    var searchResultCombination = [];
    for(var i = 0; i < searchResults.length; i++) {
      searchResultCombination = searchResultCombination.concat(searchResults[i]); // replace with sorted merge algorithm
    }
    res.json(searchResultCombination);
  });
});

router.get('/:field', function(req, res) {
  modelMap[req.params.field].find({}, function(err, values) {
    if(err) {
      console.error(err);
    } else {
      res.json(values);
    }
  });
});

router.get('/:field/:name', function(req, res) {
  modelMap[req.params.field].find({name: req.params.name}, function(err, value) {
    if(err) {
      console.error(err);
    } else {
      res.json(value);
    }
  });
});

app.use('/api', router);

app.listen(3000, function() {
  console.log('Listening on port 3000')
});

