
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./models/db'); // Keep this declaration
const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/logs');

// Import routes
const projectRoutes = require('./routes/projects');
const moduleRoutes = require('./routes/modules');
const scenarioRoutes = require('./routes/scenarios');
const testCaseRoutes = require('./routes/testCases');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB(); // Use the existing declaration

// Use routes
app.use('/api/projects', projectRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/testcases', testCaseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

// Error handling middleware (must be before 404 handler)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 errors (should be last)
app.use((req, res) => {
  console.log('404 for:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});