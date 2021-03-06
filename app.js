var Project = require('./models/project');
var Position = require('./models/position');
var Skill = require('./models/skill');
var modelMap = require('./utils/modelMap');
var reloadData = require('./utils/reloadData');
var mergeSortedArrays = require('./utils/mergeSortedArrays');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var router = express.Router();

app.set('json spaces', 2);

var MONGODB_URI = process.env.OPENSHIFT_MONGODB_DB_URL
  ? `mongodb://${process.env.OPENSHIFT_MONGODB_DB_USERNAME}:${process.env.OPENSHIFT_MONGODB_DB_PASSWORD}@${process.env.OPENSHIFT_MONGODB_DB_HOST}:${process.env.OPENSHIFT_MONGODB_DB_PORT}/`
  : 'mongodb://localhost/';
mongoose.connect(MONGODB_URI+'avik', reloadData);

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
      searchResultCombination = mergeSortedArrays(searchResultCombination, searchResults[i]);
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
  try {
    modelMap[req.params.field].find({name: req.params.name}, function(err, value) {
      if(err) {
        console.error(err);
      } else {
        res.json(value);
      }
    });
  } catch(e) {
    res.send('bad request');
  }
});

app.use('/api', router);

var IP_ADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(PORT, IP_ADDRESS, function() {
  console.log('Listening on port 3000')
});

