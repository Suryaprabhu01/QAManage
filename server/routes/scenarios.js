const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');

// Log all requests to scenarios routes
router.use((req, res, next) => {
  console.log('Scenarios Route:', req.method, req.url);
  next();
});

// Create a new scenario
router.post('/', scenarioController.createScenario);

// Get all scenarios for a module
router.get('/:moduleId', scenarioController.getScenarios);

// Get a specific scenario
router.get('/detail/:id', scenarioController.getScenarioById);

// Update a scenario
router.put('/:id', scenarioController.updateScenario);

// Delete a scenario
router.delete('/:id', scenarioController.deleteScenario);

module.exports = router;