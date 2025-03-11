const TestCase = require('../models/TestCase');
const Scenario = require('../models/Scenario');
const mongoose = require('mongoose');

exports.createTestCase = async (req, res) => {
  try {
    console.log('Creating test case with data:', req.body);
       
    const { 
      scenarioId, 
      testCaseName, 
      description, 
      expectedResult, 
      priority, 
      status 
    } = req.body;

    // Validate required fields
    if (!scenarioId || !testCaseName || !description || !expectedResult) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate scenarioId format
    if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scenario ID format'
      });
    }

    // Check if scenario exists
    const scenario = await Scenario.findById(scenarioId);
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    const testCase = new TestCase({
      scenarioId,
      testCaseName,
      description,
      expectedResult,
      priority: priority || 'Medium',
      status: status || 'Active'
    });

    const savedTestCase = await testCase.save();

    // Update scenario's test cases count
    await Scenario.findByIdAndUpdate(scenarioId, {
      $inc: { casesCount: 1 }
    });

    res.status(201).json({
      success: true,
      data: savedTestCase
    });
  } catch (error) {
    console.error('Error creating test case:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test case',
      error: error.message
    });
  }
};

exports.getTestCases = async (req, res) => {
  try {
    const { scenarioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scenario ID format'
      });
    }

    const testCases = await TestCase.find({ scenarioId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: testCases
    });
  } catch (error) {
    console.error('Error fetching test cases:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test cases',
      error: error.message
    });
  }
};

exports.getTestCaseById = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase) {
      return res.status(404).json({
        success: false,
        message: 'Test case not found'
      });
    }

    res.json({
      success: true,
      data: testCase
    });
  } catch (error) {
    console.error('Error fetching test case:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test case',
      error: error.message
    });
  }
};

exports.updateTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!testCase) {
      return res.status(404).json({
        success: false,
        message: 'Test case not found'
      });
    }

    res.json({
      success: true,
      data: testCase
    });
  } catch (error) {
    console.error('Error updating test case:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating test case',
      error: error.message
    });
  }
};

exports.deleteTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase) {
      return res.status(404).json({
        success: false,
        message: 'Test case not found'
      });
    }

    const scenarioId = testCase.scenarioId;

    await testCase.remove();

    // Update scenario's test cases count
    await Scenario.findByIdAndUpdate(scenarioId, {
      $inc: { casesCount: -1 }
    });

    res.json({
      success: true,
      message: 'Test case deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting test case:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting test case',
      error: error.message
    });
  }
}; 