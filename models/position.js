var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PositionSchema = new Schema({
  name: String,
  organization: String,
  organizationUrl: String,
  start: String,
  end: String,
  description: String,
  keywords: [String]
});
PositionSchema.index({
  name: "text",
  organization: "text",
  description: "text",
  keywords: "text"
}, 
{
  weights: {
    name: 3,
    organization: 3,
    description: 1,
    keywords: 2
  }
});
var Position = mongoose.model('Position', PositionSchema);

module.exports = Position;