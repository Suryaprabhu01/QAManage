const express = require('express');
const router = express.Router();

// Get all admins
router.get('/', (req, res) => {
  res.json({ admins: [] });
});

// Create new admin
router.post('/create', (req, res) => {
  try {
    const { name, email, position, password } = req.body;
    // For now, just return the data (we'll add database integration later)
    res.status(201).json({
      message: 'Admin created successfully',
      admin: { name, email, position }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin' });
  }
});

module.exports = router; 