const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  scenarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scenario',
    required: true
  },
  testCaseId: {
    type: String,
    unique: true
  },
  testCaseName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expectedResult: {
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
    enum: ['Active', 'Draft', 'Completed'],
    default: 'Active'
  },
  createdBy: {
    type: String,
    default: 'System'
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

// Modified pre-save hook to generate module-specific testcase IDs
testCaseSchema.pre('save', async function(next) {
  try {
    if (!this.testCaseId) {
      // Get the scenario to find its moduleId
      const scenario = await mongoose.model('Scenario').findById(this.scenarioId);
      if (!scenario) {
        throw new Error('Scenario not found');
      }

      // Find the highest testCaseId for this module
      const highestTestCase = await mongoose.model('TestCase')
        .findOne({
          scenarioId: { 
            $in: await mongoose.model('Scenario')
              .find({ moduleId: scenario.moduleId })
              .distinct('_id')
          }
        })
        .sort({ testCaseId: -1 });

      let nextNumber = 1;
      if (highestTestCase && highestTestCase.testCaseId) {
        // Extract the number from existing testCaseId and increment
        const currentNumber = parseInt(highestTestCase.testCaseId.slice(-3));
        nextNumber = currentNumber + 1;
      }

      // Format the testCaseId with padded zeros
      this.testCaseId = `TC${String(nextNumber).padStart(3, '0')}`;
    }
    
    this.updatedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('TestCase', testCaseSchema); 