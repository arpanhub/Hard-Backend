// Security utility functions for the application
const crypto = require('crypto');

/**
 * Validates JWT secret strength
 * @param {string} secret - The JWT secret to validate
 * @returns {object} - Validation result with isValid boolean and issues array
 */
const validateJWTSecret = (secret) => {
  const issues = [];
  
  if (!secret) {
    issues.push('JWT secret is required');
    return { isValid: false, issues };
  }
  
  if (typeof secret !== 'string') {
    issues.push('JWT secret must be a string');
    return { isValid: false, issues };
  }
  
  // Check minimum length (256 bits = 32 bytes = 64 hex characters)
  if (secret.length < 32) {
    issues.push('JWT secret should be at least 32 characters long for security');
  }
  
  // Check for common weak secrets
  const weakSecrets = [
    'secret',
    'password',
    'jwt_secret',
    'your_secret_key',
    'changeme',
    'default',
    '123456',
    'secret123'
  ];
  
  if (weakSecrets.includes(secret.toLowerCase())) {
    issues.push('JWT secret appears to be a common weak secret');
  }
  
  // Check for sufficient entropy (basic check for randomness)
  const uniqueChars = new Set(secret.toLowerCase()).size;
  if (uniqueChars < 8) {
    issues.push('JWT secret appears to have low entropy (not random enough)');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    strength: getSecretStrength(secret)
  };
};

/**
 * Determines the strength of a secret
 * @param {string} secret - The secret to evaluate
 * @returns {string} - Strength level: 'weak', 'medium', 'strong'
 */
const getSecretStrength = (secret) => {
  if (!secret || secret.length < 16) return 'weak';
  if (secret.length < 32) return 'medium';
  
  const hasUppercase = /[A-Z]/.test(secret);
  const hasLowercase = /[a-z]/.test(secret);
  const hasNumbers = /[0-9]/.test(secret);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(secret);
  
  const criteriaCount = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
  
  if (secret.length >= 32 && criteriaCount >= 3) return 'strong';
  if (secret.length >= 24 && criteriaCount >= 2) return 'medium';
  
  return 'weak';
};

/**
 * Generates a cryptographically secure random secret
 * @param {number} length - Length of the secret in bytes (default: 32)
 * @returns {string} - Hex encoded random secret
 */
const generateSecureSecret = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Sanitizes error messages to prevent sensitive information disclosure
 * @param {Error} error - The error object
 * @param {boolean} isProduction - Whether running in production
 * @returns {object} - Sanitized error information
 */
const sanitizeError = (error, isProduction = process.env.NODE_ENV === 'production') => {
  // In production, don't expose detailed error information
  if (isProduction) {
    return {
      message: 'Internal server error',
      statusCode: error.statusCode || 500
    };
  }
  
  // In development, provide more details but still sanitize sensitive info
  let message = error.message || 'Internal server error';
  
  // Remove potential sensitive information from error messages
  const sensitivePatterns = [
    /password/gi,
    /secret/gi,
    /token/gi,
    /key/gi,
    /mongodb:\/\/[^\/]+/gi, // MongoDB connection strings
    /jwt\s*[:=]\s*[^\s]+/gi, // JWT tokens
    /authorization:\s*bearer\s+[^\s]+/gi // Bearer tokens
  ];
  
  sensitivePatterns.forEach(pattern => {
    message = message.replace(pattern, '[REDACTED]');
  });
  
  return {
    message,
    statusCode: error.statusCode || 500,
    stack: error.stack // Only in development
  };
};

/**
 * Validates environment variables for security
 * @returns {object} - Validation result
 */
const validateEnvironmentSecurity = () => {
  const issues = [];
  const warnings = [];
  
  // Check required environment variables
  const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      issues.push(`Missing required environment variable: ${varName}`);
    }
  });
  
  // Validate JWT secret
  if (process.env.JWT_SECRET) {
    const jwtValidation = validateJWTSecret(process.env.JWT_SECRET);
    if (!jwtValidation.isValid) {
      issues.push(...jwtValidation.issues.map(issue => `JWT_SECRET: ${issue}`));
    }
    if (jwtValidation.strength === 'weak') {
      warnings.push('JWT_SECRET strength is weak, consider using a stronger secret');
    }
  }
  
  // Check for development values in production
  if (process.env.NODE_ENV === 'production') {
    const devIndicators = ['localhost', '127.0.0.1', 'test', 'dev', 'development'];
    Object.keys(process.env).forEach(key => {
      const value = process.env[key].toLowerCase();
      if (devIndicators.some(indicator => value.includes(indicator))) {
        warnings.push(`${key} appears to contain development values in production`);
      }
    });
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings
  };
};

module.exports = {
  validateJWTSecret,
  getSecretStrength,
  generateSecureSecret,
  sanitizeError,
  validateEnvironmentSecurity
};