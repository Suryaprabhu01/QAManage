const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  scenarioName: {
    type: String,
    required: true
  },
  scenarioId: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Archived'],
    default: 'Active'
  },
  casesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate scenarioId before saving
scenarioSchema.pre('save', async function(next) {
  try {
    if (!this.scenarioId) {
      const count = await mongoose.model('Scenario').countDocuments();
      this.scenarioId = `SCN${String(count + 1).padStart(4, '0')}`;
    }
    this.updatedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Scenario', scenarioSchema); 