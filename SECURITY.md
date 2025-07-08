# Security Guide - Hard-Backend

## Overview
This document outlines the security measures implemented in the Hard-Backend application to protect against common security vulnerabilities and ensure the safety of user data and application secrets.

## Security Measures Implemented

### 1. Secret Management

#### JWT Secret Security
- **Validation**: JWT secrets are validated for strength and security at application startup
- **Minimum Length**: JWT secrets must be at least 32 characters long
- **Entropy Check**: Secrets are checked for randomness and complexity
- **Weak Secret Detection**: Common weak secrets are rejected
- **Environment Variable**: JWT secrets are stored in environment variables, never hardcoded

#### Password Security
- **Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
- **Minimum Requirements**: Passwords must be at least 6 characters long
- **Secure Storage**: Passwords are never stored in plain text
- **Seed Data**: Hardcoded passwords removed from seed data, replaced with secure random generation

#### Database Connection Security
- **Environment Variables**: Database connection strings stored in environment variables
- **Error Sanitization**: Database connection errors are sanitized to prevent information disclosure

### 2. Rate Limiting

#### Authentication Rate Limiting
- **Login Attempts**: Maximum 5 login attempts per 15-minute window
- **Password Reset**: Maximum 3 password reset requests per hour
- **Email Verification**: Maximum 3 verification attempts per 15-minute window
- **Registration**: Maximum 3 registration attempts per hour
- **General Auth**: Maximum 20 authentication requests per 15-minute window

#### API Rate Limiting
- **General API**: Maximum 100 requests per 15-minute window
- **IP-based**: Rate limiting based on client IP address
- **Skip Successful**: Successful requests don't count against login rate limit

### 3. Error Handling and Information Disclosure Prevention

#### Error Sanitization
- **Production Mode**: Detailed error information hidden in production
- **Sensitive Data**: Automatic removal of sensitive information from error messages
- **Pattern Matching**: Removal of passwords, tokens, secrets, and connection strings from errors
- **Stack Traces**: Stack traces only shown in development mode

#### Response Security
- **Consistent Messages**: Generic error messages for authentication failures
- **No User Enumeration**: Preventing user enumeration through error messages
- **Status Codes**: Appropriate HTTP status codes for different error types

### 4. Security Headers

#### HTTP Security Headers
- **Content Security Policy**: Strict CSP to prevent XSS attacks
- **HSTS**: HTTP Strict Transport Security with 1-year max age
- **X-Frame-Options**: Preventing clickjacking attacks
- **X-Content-Type-Options**: Preventing MIME type sniffing
- **X-XSS-Protection**: XSS protection (legacy browsers)
- **Referrer Policy**: Controlling referrer information
- **Permissions Policy**: Controlling browser feature access

#### Server Information
- **X-Powered-By**: Header removed to prevent server fingerprinting
- **Server Identification**: Generic server responses

### 5. Input Validation and Data Protection

#### Data Validation
- **Schema Validation**: Mongoose schema validation for all data
- **Email Validation**: Regex validation for email formats
- **Length Limits**: Maximum length limits for user inputs
- **Sanitization**: Input sanitization to prevent injection attacks

#### Token Security
- **Verification Tokens**: Cryptographically secure random tokens
- **Password Reset Tokens**: Time-limited tokens with expiration
- **JWT Tokens**: Secure JWT implementation with proper signing

### 6. Environment Security

#### Environment Variable Validation
- **Required Variables**: Validation of required environment variables at startup
- **Security Strength**: Validation of security-critical variables
- **Development Detection**: Detection of development values in production
- **Warning System**: Warnings for potential security issues

#### Configuration Security
- **CORS**: Proper CORS configuration for allowed origins
- **JSON Limits**: Request body size limits to prevent DoS
- **Morgan Logging**: Secure logging configuration

## Environment Variables Required

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hard-backend

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# Optional: Seed Data Passwords (for development only)
SEED_ADMIN_PASSWORD=secure-admin-password
SEED_USER_PASSWORD=secure-user-password

# Environment
NODE_ENV=production
PORT=5000
```

## Security Checklist

### Before Deployment
- [ ] Ensure JWT_SECRET is at least 32 characters long and cryptographically secure
- [ ] Verify all environment variables are properly set
- [ ] Check that no hardcoded passwords or secrets exist in the codebase
- [ ] Ensure CORS is configured for your specific domain
- [ ] Verify rate limiting is properly configured
- [ ] Test error handling doesn't expose sensitive information

### Regular Security Maintenance
- [ ] Review and rotate JWT secrets periodically
- [ ] Monitor rate limiting effectiveness
- [ ] Review error logs for security issues
- [ ] Update dependencies regularly
- [ ] Perform security audits
- [ ] Review and update security headers as needed

## Security Best Practices

### For Developers
1. **Never hardcode secrets**: Always use environment variables
2. **Use strong passwords**: Generate cryptographically secure passwords
3. **Validate inputs**: Always validate and sanitize user inputs
4. **Handle errors securely**: Never expose sensitive information in error messages
5. **Use HTTPS**: Always use HTTPS in production
6. **Keep dependencies updated**: Regularly update npm packages
7. **Follow principle of least privilege**: Grant minimum required permissions

### For Deployment
1. **Use environment variables**: Store all configuration in environment variables
2. **Enable security headers**: Use all recommended security headers
3. **Monitor logs**: Regularly review application logs
4. **Use reverse proxy**: Consider using a reverse proxy like Nginx
5. **Regular backups**: Maintain regular database backups
6. **Network security**: Implement proper network-level security

## Incident Response

### Security Incident Procedure
1. **Immediate Response**: Isolate affected systems
2. **Assessment**: Determine scope and impact
3. **Containment**: Prevent further damage
4. **Recovery**: Restore systems and data
5. **Post-Incident**: Review and improve security measures

### Contact Information
- **Security Team**: [Your security team contact]
- **Emergency Contact**: [Emergency contact information]

## Resources

### Security Tools
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### Monitoring
- Consider implementing security monitoring tools
- Set up alerts for suspicious activities
- Regular security assessments

---

**Last Updated**: [Current Date]
**Version**: 1.0
**Review Schedule**: Quarterly