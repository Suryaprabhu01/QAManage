const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  projectId: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Completed'],
    default: 'Active'
  },
  modulesCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true
});

// Generate projectId before saving
projectSchema.pre('save', async function (next) {
  try {
    if (!this.projectId) {
      const count = await mongoose.model('Project').estimatedDocumentCount(); // More efficient than countDocuments()
      this.projectId = `PRJ${String(count + 1).padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    console.error('Error generating projectId:', error);
    next(); // Don't block the save operation
  }
});

module.exports = mongoose.model('Project', projectSchema);