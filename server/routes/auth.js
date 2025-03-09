const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Log all requests
router.use((req, res, next) => {
  console.log('Auth Route:', req.method, req.url);
  next();
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router; 