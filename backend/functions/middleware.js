// Middleware functions for the PG Wale Bhaiya backend (Edge-compatible)

const utils = require('./utils');
const config = require('./config');
const fetch = require('node-fetch'); // Use fetch for REST API calls

// ============= AUTHENTICATION MIDDLEWARE =============

/**
 * Middleware to verify admin authentication (Edge-compatible)
 */
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json(utils.createErrorResponse(
        'Authentication token required',
        401,
        'NO_TOKEN'
      ));
    }

    const decoded = await utils.verifyTokenEdge(token); // Use Edge-compatible token verification
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json(utils.createErrorResponse(
        'Admin access required',
        403,
        'INVALID_ADMIN'
      ));
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(401).json(utils.createErrorResponse(
      'Invalid authentication token',
      401,
      'INVALID_TOKEN'
    ));
  }
};

/**
 * Middleware to verify landlord authentication (Edge-compatible)
 */
const verifyLandlord = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json(utils.createErrorResponse(
        'Authentication token required',
        401,
        'NO_TOKEN'
      ));
    }

    const decoded = await utils.verifyTokenEdge(token);
    if (!decoded || (decoded.role !== 'landlord' && decoded.role !== 'admin')) {
      return res.status(403).json(utils.createErrorResponse(
        'Landlord access required',
        403,
        'INVALID_LANDLORD'
      ));
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Landlord verification error:', error);
    return res.status(401).json(utils.createErrorResponse(
      'Invalid authentication token',
      401,
      'INVALID_TOKEN'
    ));
  }
};

// ============= RATE LIMITING MIDDLEWARE =============

/**
 * Distributed rate limiter using Vercel KV or similar service
 */
const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // 100 requests per window
    message = 'Too many requests, please try again later.'
  } = options;

  return async (req, res, next) => {
    try {
      const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const now = Date.now();
      const windowStart = Math.floor(now / windowMs) * windowMs;

      // Use a distributed store (e.g., Vercel KV) for rate limiting
      const rateLimitKey = `rate-limit:${key}:${windowStart}`;
      const currentCount = await utils.getRateLimitCount(rateLimitKey);

      if (currentCount >= max) {
        return res.status(429).json(utils.createErrorResponse(
          message,
          429,
          'RATE_LIMIT_EXCEEDED'
        ));
      }

      await utils.incrementRateLimitCount(rateLimitKey, windowMs);
      res.set({
        'X-RateLimit-Limit': max,
        'X-RateLimit-Remaining': Math.max(0, max - currentCount - 1),
        'X-RateLimit-Reset': new Date(windowStart + windowMs).toISOString()
      });

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next();
    }
  };
};

// ============= SECURITY MIDDLEWARE =============

/**
 * Basic security headers (Edge-compatible)
 */
const securityHeaders = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });

  next();
};

module.exports = {
  // Authentication
  verifyAdmin,
  verifyLandlord,

  // Rate limiting
  rateLimit,

  // Security
  securityHeaders
};
