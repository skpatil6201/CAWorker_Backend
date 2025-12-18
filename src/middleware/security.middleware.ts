import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { Logger } from '../utils/logger';
import { HTTP_STATUS } from '../utils/constants';

// Simple in-memory rate limiter
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export const rateLimit = (windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
    } else if (rateLimitStore[clientId].resetTime < now) {
      rateLimitStore[clientId] = {
        count: 1,
        resetTime: now + windowMs
      };
    } else {
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
      Logger.warn(`Rate limit exceeded for IP: ${clientId}`, {
        count,
        limit: maxRequests,
        resetTime: new Date(resetTime).toISOString()
      });
      
      return sendError(
        res, 
        'Too many requests', 
        `Rate limit exceeded. Try again after ${new Date(resetTime).toISOString()}`, 
        429
      );
    }
    
    next();
  };
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Set security headers (less strict in development)
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  const headers: Record<string, string> = {
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

// Request size limiter
export const requestSizeLimiter = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('content-length');
    if (contentLength) {
      const sizeInBytes = parseInt(contentLength);
      const maxSizeInBytes = parseSize(maxSize);
      
      if (sizeInBytes > maxSizeInBytes) {
        Logger.warn(`Request size exceeded limit`, {
          size: sizeInBytes,
          limit: maxSizeInBytes,
          ip: req.ip
        });
        
        return sendError(
          res,
          'Request too large',
          `Request size exceeds ${maxSize} limit`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    
    next();
  };
};

// Helper function to parse size strings like '10mb', '1gb', etc.
function parseSize(size: string): number {
  const units: { [key: string]: number } = {
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