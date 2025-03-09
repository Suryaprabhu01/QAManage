const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

// Log all requests
router.use((req, res, next) => {
  console.log('Modules Route:', req.method, req.url, req.body);
  next();
});

router.post('/', moduleController.createModule);
router.get('/', moduleController.getModules);

module.exports = router; 