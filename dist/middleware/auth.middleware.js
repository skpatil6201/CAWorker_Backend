"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return (0, response_1.sendError)(res, 'Access token required', undefined, 401);
    }
    try {
        const decoded = (0, auth_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Invalid or expired token', undefined, 403);
    }
};
exports.authenticateToken = authenticateToken;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_1.sendError)(res, 'Authentication required', undefined, 401);
        }
        if (!roles.includes(req.user.role || req.user.userType)) {
            return (0, response_1.sendError)(res, 'Insufficient permissions', undefined, 403);
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
