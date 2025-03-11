const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  moduleName: {
    type: String,
    required: true
  },
  moduleId: {
    type: String,
    unique: true
  },
  subModuleName: {
    type: String,
    required: true
  },
  lastTested: {
    type: Date,
    default: Date.now
  },
  lastTestedBy: {
    type: String,
    default: 'Not tested'
  },
  scenariosCount: {
    type: Number,
    default: 0
  },
  casesCount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Generate moduleId before saving
moduleSchema.pre('save', async function(next) {
  try {
    if (!this.moduleId) {
      const count = await mongoose.model('Module').countDocuments();
      this.moduleId = `MOD${String(count + 1).padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Module', moduleSchema); 