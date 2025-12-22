"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.SUCCESS_MESSAGES = exports.VALIDATION_MESSAGES = exports.HTTP_STATUS = exports.FIRM_TYPES = exports.EXPERIENCE_LEVELS = exports.GENDER_TYPES = exports.STATUS_TYPES = exports.ADMIN_ROLES = exports.USER_TYPES = void 0;
exports.USER_TYPES = {
    CANDIDATE: 'candidate',
    FIRM: 'firm',
    ADMIN: 'admin'
};
exports.ADMIN_ROLES = {
    SUPER_ADMIN: 'SuperAdmin',
    ADMIN: 'Admin'
};
exports.STATUS_TYPES = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
};
exports.GENDER_TYPES = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other'
};
exports.EXPERIENCE_LEVELS = {
    ENTRY: '0-1',
    JUNIOR: '1-3',
    MID: '3-5',
    SENIOR: '5+'
};
exports.FIRM_TYPES = {
    PARTNERSHIP: 'Partnership',
    LLP: 'LLP',
    PRIVATE_LTD: 'Private Ltd',
    OTHERS: 'Others'
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};
exports.VALIDATION_MESSAGES = {
    REQUIRED: (field) => `${field} is required`,
    INVALID_EMAIL: 'Please provide a valid email address',
    INVALID_PHONE: 'Please provide a valid Indian mobile number',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
    PASSWORD_COMPLEXITY: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    INVALID_DATE: 'Please provide a valid date',
    INVALID_GENDER: 'Gender must be Male, Female, or Other',
    INVALID_EXPERIENCE: 'Years of experience must be one of: 0-1, 1-3, 3-5, 5+',
    INVALID_FIRM_TYPE: 'Firm type must be one of: Partnership, LLP, Private Ltd, Others',
    INVALID_STATUS: 'Status must be Pending, Approved, or Rejected',
    INVALID_ROLE: 'Role must be either SuperAdmin or Admin'
};
exports.SUCCESS_MESSAGES = {
    REGISTERED: 'Registration successful',
    LOGIN: 'Login successful',
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    RETRIEVED: 'Retrieved successfully',
    STATUS_UPDATED: 'Status updated successfully'
};
exports.ERROR_MESSAGES = {
    ALREADY_EXISTS: 'Already exists with this email',
    INVALID_CREDENTIALS: 'Invalid credentials',
    NOT_FOUND: 'Not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Insufficient permissions',
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
    INVALID_TOKEN: 'Invalid or expired token',
    TOKEN_REQUIRED: 'Access token required'
};
