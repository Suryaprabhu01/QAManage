const TestCase = require('../models/TestCase');
const Scenario = require('../models/Scenario');
const logActivity = require('../middleware/Logger'); // Ensure the correct path
const mongoose = require('mongoose');

// Create new test case
exports.createTestCase = async (req, res) => {
  const { scenarioId, testCaseName, description, expectedResult, priority, status, username } = req.body;
  try {
    const testCase = new TestCase({ scenarioId, testCaseName, description, expectedResult, priority, status });
    await testCase.save();

    // Log the activity
    await logActivity('TestCase', `Created Test Case ${testCaseName}`, 'TestCase', "username");

    res.status(201).json({ success: true, data: testCase });
  } catch (error) {
    console.error('Error creating test case:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get all test cases for a scenario
exports.getTestCases = async (req, res) => {
  const { scenarioId } = req.params;
  try {
    const testCases = await TestCase.find({ scenarioId }).sort({ createdAt: -1 });
    res.json({ success: true, data: testCases });
  } catch (error) {
    console.error('Error fetching test cases:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get single test case by ID
exports.getTestCaseById = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase) {
      return res.status(404).json({ success: false, message: 'Test case not found' });
    }
    res.json({ success: true, data: testCase });
  } catch (error) {
    console.error('Error fetching test case:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update test case
exports.updateTestCase = async (req, res) => {
  const { testCaseName, description, expectedResult, priority, status, username } = req.body;
  try {
    const testCase = await TestCase.findByIdAndUpdate(
      req.params.id,
      { testCaseName, description, expectedResult, priority, status, updatedAt: new Date() },
      { new: true }
    );

    if (!testCase) {
      return res.status(404).json({ success: false, message: 'Test case not found' });
    }

    // Log the activity
    await logActivity('TestCase', `Updated Test Case ${testCaseName}`, 'TestCase', username);

    res.json({ success: true, data: testCase });
  } catch (error) {
    console.error('Error updating test case:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete test case
exports.deleteTestCase = async (req, res) => {
  const { username } = req.body;
  try {
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase) {
      return res.status(404).json({ success: false, message: 'Test case not found' });
    }

    const scenarioId = testCase.scenarioId;
    await testCase.remove();

    // Log the activity
    await logActivity('TestCase', `Deleted Test Case ${testCase.testCaseName}`, 'TestCase', username);

    res.json({ success: true, message: 'Test case deleted successfully' });
  } catch (error) {
    console.error('Error deleting test case:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};