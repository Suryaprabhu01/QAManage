const express = require('express');
const router = express.Router();
const testCaseController = require('../controllers/testCaseController');

// Log all requests
router.use((req, res, next) => {
  console.log('TestCases Route:', req.method, req.url, req.body);
  next();
});

// Create a new test case
router.post('/', testCaseController.createTestCase);

// Get all test cases for a scenario
router.get('/:scenarioId', testCaseController.getTestCases);

// Get a specific test case
router.get('/detail/:id', testCaseController.getTestCaseById);

// Update a test case
router.put('/:id', testCaseController.updateTestCase);

// Delete a test case
router.delete('/:id', testCaseController.deleteTestCase);

module.exports = router; 