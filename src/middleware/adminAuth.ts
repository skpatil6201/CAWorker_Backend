import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if user is admin (check both role and userType for compatibility)
  const userRole = (req.user.role || req.user.userType || '').toLowerCase();
  
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

export const requireAdminOrOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const userRole = req.user.role || req.user.userType;
  const userId = req.user.id || req.user._id;
  const resourceUserId = req.params.userId || req.body.userId;

  // Allow if user is admin or if they're accessing their own resource
  if (userRole === 'admin' || userId === resourceUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Admin access or resource ownership required'
  });
};