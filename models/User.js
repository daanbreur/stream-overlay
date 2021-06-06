const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  twitchId: {type: String, required: true},
  displayName: String,
  team: String,
  points: {type: Number, default: 0},
  permissions: {
    refreshOverlayElements: {type: Boolean, default: false},
    adminCommands: {type: Boolean, default: false},
    overlayMessage: {type: Boolean, default: false},
    pointManagement: {type: Boolean, default: false},
    customCommandManagement: {type: Boolean, default: false},
  }
});

module.exports = mongoose.model('User', userSchema);