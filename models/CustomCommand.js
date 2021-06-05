const mongoose = require('mongoose');

const customCommandSchema = new mongoose.Schema({
  command: String,
  response: String,
  permissions: {type: [String], required: false, default: []}
});

module.exports = mongoose.model('CustomCommand', customCommandSchema);