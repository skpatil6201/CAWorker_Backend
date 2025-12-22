"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSizeLimiter = exports.securityHeaders = exports.rateLimit = void 0;
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const constants_1 = require("../utils/constants");
const rateLimitStore = {};
const rateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
    return (req, res, next) => {
        const clientId = req.ip || 'unknown';
        const now = Date.now();
        // Clean up expired entries
        Object.keys(rateLimitStore).forEach(key => {
            if (rateLimitStore[key].resetTime < now) {
                delete rateLimitStore[key];
            }
        });
        if (!rateLimitStore[clientId]) {
            rateLimitStore[clientId] = {
                count: 1,
                resetTime: now + windowMs
            };
        }
        else if (rateLimitStore[clientId].resetTime < now) {
            rateLimitStore[clientId] = {
                count: 1,
                resetTime: now + windowMs
            };
        }
        else {
            rateLimitStore[clientId].count++;
        }
        const { count, resetTime } = rateLimitStore[clientId];
        // Set rate limit headers
        res.set({
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, maxRequests - count).toString(),
            'X-RateLimit-Reset': new Date(resetTime).toISOString()
        });
        if (count > maxRequests) {
            logger_1.Logger.warn(`Rate limit exceeded for IP: ${clientId}`, {
                count,
                limit: maxRequests,
                resetTime: new Date(resetTime).toISOString()
            });
            return (0, response_1.sendError)(res, 'Too many requests', `Rate limit exceeded. Try again after ${new Date(resetTime).toISOString()}`, 429);
        }
        next();
    };
};
exports.rateLimit = rateLimit;
// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Set security headers (less strict in development)
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const headers = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
    // Only add strict CSP and HSTS in production
    if (!isDevelopment) {
        headers['Content-Security-Policy'] = "default-src 'self'";
        headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    }
    res.set(headers);
    next();
};
exports.securityHeaders = securityHeaders;
// Request size limiter
const requestSizeLimiter = (maxSize = '10mb') => {
    return (req, res, next) => {
        const contentLength = req.get('content-length');
        if (contentLength) {
            const sizeInBytes = parseInt(contentLength);
            const maxSizeInBytes = parseSize(maxSize);
            if (sizeInBytes > maxSizeInBytes) {
                logger_1.Logger.warn(`Request size exceeded limit`, {
                    size: sizeInBytes,
                    limit: maxSizeInBytes,
                    ip: req.ip
                });
                return (0, response_1.sendError)(res, 'Request too large', `Request size exceeds ${maxSize} limit`, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
        }
        next();
    };
};
exports.requestSizeLimiter = requestSizeLimiter;
// Helper function to parse size strings like '10mb', '1gb', etc.
function parseSize(size) {
    const units = {
        'b': 1,
        'kb': 1024,
        'mb': 1024 * 1024,
        'gb': 1024 * 1024 * 1024
    };
    const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)(b|kb|mb|gb)$/);
    if (!match) {
        throw new Error(`Invalid size format: ${size}`);
    }
    const [, value, unit] = match;
    return parseFloat(value) * units[unit];
}
