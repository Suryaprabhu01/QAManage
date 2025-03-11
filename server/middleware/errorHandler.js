const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack);

  // Log request details
  console.error('Request Details:', {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler; 