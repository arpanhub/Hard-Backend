// Error handler middleware with security considerations
const { sanitizeError } = require('../utils/security');

module.exports = (err, req, res, next) => {
  // Log the full error for debugging (server-side only)
  console.error('Error occurred:', err);
  
  // Sanitize error for client response
  const sanitizedError = sanitizeError(err);
  
  res.status(sanitizedError.statusCode).json({
    success: false,
    message: sanitizedError.message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV !== 'production' && { stack: sanitizedError.stack })
  });
};
