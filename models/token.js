const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  refreshToken: {
    type: String
  }
}, {timestamps: true})

module.exports = RefreshToken = mongoose.model('refresh-token', schema)