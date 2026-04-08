import { body, param, query } from 'express-validator';

// Validation for creating a new gallery image
export const validateCreateGalleryImage = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
    
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['office', 'team', 'client', 'services', 'events', 'awards'])
    .withMessage('Category must be one of: office, team, client, services, events, awards'),
    
  body('src')
    .notEmpty()
    .withMessage('Image source is required'),
    
  body('alt')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Alt text cannot exceed 200 characters'),
    
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Validation for updating a gallery image
export const validateUpdateGalleryImage = [
  param('id')
    .isMongoId()
    .withMessage('Invalid gallery image ID'),
    
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
    
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
    
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isIn(['office', 'team', 'client', 'services', 'events', 'awards'])
    .withMessage('Category must be one of: office, team, client, services, events, awards'),
    
  body('src')
    .optional()
    .notEmpty()
    .withMessage('Image source cannot be empty'),
    
  body('alt')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Alt text cannot exceed 200 characters'),
    
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Validation for getting gallery image by ID
export const validateGetGalleryImageById = [
  param('id')
    .isMongoId()
    .withMessage('Invalid gallery image ID')
];

// Validation for deleting gallery image
export const validateDeleteGalleryImage = [
  param('id')
    .isMongoId()
    .withMessage('Invalid gallery image ID')
];

// Validation for toggling gallery image status
export const validateToggleGalleryImageStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid gallery image ID')
];

// Validation for getting gallery images by category
export const validateGetGalleryImagesByCategory = [
  param('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['office', 'team', 'client', 'services', 'events', 'awards'])
    .withMessage('Category must be one of: office, team, client, services, events, awards')
];

// Validation for query parameters
export const validateGalleryQuery = [
  query('category')
    .optional()
    .trim()
    .isIn(['office', 'team', 'client', 'services', 'events', 'awards'])
    .withMessage('Category must be one of: office, team, client, services, events, awards'),
    
  query('isActive')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isActive must be true or false'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
];