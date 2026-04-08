"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGalleryQuery = exports.validateGetGalleryImagesByCategory = exports.validateToggleGalleryImageStatus = exports.validateDeleteGalleryImage = exports.validateGetGalleryImageById = exports.validateUpdateGalleryImage = exports.validateCreateGalleryImage = void 0;
const express_validator_1 = require("express-validator");
// Validation for creating a new gallery image
exports.validateCreateGalleryImage = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1 and 500 characters'),
    (0, express_validator_1.body)('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['office', 'team', 'client', 'services', 'events', 'awards'])
        .withMessage('Category must be one of: office, team, client, services, events, awards'),
    (0, express_validator_1.body)('src')
        .notEmpty()
        .withMessage('Image source is required'),
    (0, express_validator_1.body)('alt')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Alt text cannot exceed 200 characters'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value')
];
// Validation for updating a gallery image
exports.validateUpdateGalleryImage = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid gallery image ID'),
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Description cannot be empty')
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1 and 500 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Category cannot be empty')
        .isIn(['office', 'team', 'client', 'services', 'events', 'awards'])
        .withMessage('Category must be one of: office, team, client, services, events, awards'),
    (0, express_validator_1.body)('src')
        .optional()
        .notEmpty()
        .withMessage('Image source cannot be empty'),
    (0, express_validator_1.body)('alt')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Alt text cannot exceed 200 characters'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value')
];
// Validation for getting gallery image by ID
exports.validateGetGalleryImageById = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid gallery image ID')
];
// Validation for deleting gallery image
exports.validateDeleteGalleryImage = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid gallery image ID')
];
// Validation for toggling gallery image status
exports.validateToggleGalleryImageStatus = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid gallery image ID')
];
// Validation for getting gallery images by category
exports.validateGetGalleryImagesByCategory = [
    (0, express_validator_1.param)('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['office', 'team', 'client', 'services', 'events', 'awards'])
        .withMessage('Category must be one of: office, team, client, services, events, awards')
];
// Validation for query parameters
exports.validateGalleryQuery = [
    (0, express_validator_1.query)('category')
        .optional()
        .trim()
        .isIn(['office', 'team', 'client', 'services', 'events', 'awards'])
        .withMessage('Category must be one of: office, team, client, services, events, awards'),
    (0, express_validator_1.query)('isActive')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('isActive must be true or false'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
];
