var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: String,
  url: String,
  githubUrl: String,
  technologies: [String],
  awards: [String],
  description: String
});
ProjectSchema.index({
  name: "text",
  technologies: "text",
  awards: "text",
  description: "text"
}, 
{
  weights: {
    name: 5,
    technologies: 3,
    awards: 2,
    description: 1
  }
});
var Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
