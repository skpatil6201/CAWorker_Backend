"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrOwner = exports.requireAdmin = void 0;
const requireAdmin = (req, res, next) => {
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
exports.requireAdmin = requireAdmin;
const requireAdminOrOwner = (req, res, next) => {
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
exports.requireAdminOrOwner = requireAdminOrOwner;
