const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  logMessage: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String
  },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;