const Log = require('../models/log');

const logActivity = async (label, logMessage, location, username) => {
  console.log('Logging activity:', label, logMessage, location, username);
  try {
    const log = new Log({
      label,
      logMessage,
      location,
      username,
    });
    await log.save();

  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = logActivity;