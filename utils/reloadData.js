var mongoose = require('mongoose');
var data = require('../data/avik');
var Project = require('../models/project');
var Position = require('../models/position');
var Skill = require('../models/skill');

module.exports = function(err) {
  mongoose.connection.db.dropCollection('projects');
  mongoose.connection.db.dropCollection('positions');
  mongoose.connection.db.dropCollection('skills');
  // load data into mongo from json file
  var savePromises = [];
  for(var i = 0; i < data.projects.length; i++) {
    var project = new Project(data.projects[i]);
    savePromises.push(project.save());
  }

  for(var i = 0; i < data.experience.length; i++) {
    var position = new Position(data.experience[i]);
    savePromises.push(position.save());
  }

  for(var i = 0; i < data.skills.length; i++) {
    var skill = new Skill(data.skills[i]);
    savePromises.push(skill.save());
  }

  Promise.all(savePromises).then(function(data) {
    Project.ensureIndexes();
    Position.ensureIndexes();
  });
}