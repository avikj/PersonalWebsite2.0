var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SkillSchema = new Schema({
  name: String,
  type: String,
  level: String
});

var Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;
