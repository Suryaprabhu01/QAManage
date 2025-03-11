const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Log all requests
router.use((req, res, next) => {
  console.log('Projects Route:', req.method, req.url);
  next();
});

// Create new project
router.post('/', projectController.createProject);

// Get all projects
router.get('/', projectController.getProjects);

// Get single project
router.get('/:id', projectController.getProjectById);

// Update project
router.put('/:id', projectController.updateProject);

// Delete project
router.delete('/:id', projectController.deleteProject);

module.exports = router;