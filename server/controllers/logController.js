const Log = require('../models/log');

exports.getLogs = async (req, res) => {
  const { label, startDate, endDate } = req.query;
  let query = {};

  if (label) {
    query.label = label;
  }

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  try {
    const logs = await Log.find(query).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};