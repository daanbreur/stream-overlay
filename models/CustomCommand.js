const mongoose = require('mongoose');

const customCommandSchema = new mongoose.Schema({
  command: {type: String, required: true},
  response: {type: String, required: true},
  permissions: {type: [String], required: false, default: []}
});

module.exports = mongoose.model('CustomCommand', customCommandSchema);