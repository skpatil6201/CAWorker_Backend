import { body } from 'express-validator';
import { VALIDATION_MESSAGES, ADMIN_ROLES } from '../utils/constants';

export const adminLoginValidator = [
  body('email')
    .optional()
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .trim()
    .escape(),
  
  body('password')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('Password')),
  
  // Custom validation to ensure either email or username is provided
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.username) {
      throw new Error('Either email or username is required');
    }
    return true;
  })
];

export const adminCreateValidator = [
  body('username')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('Username'))
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .trim()
    .escape(),
  
  body('email')
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(VALIDATION_MESSAGES.PASSWORD_COMPLEXITY),
  
  body('role')
    .optional()
    .isIn(Object.values(ADMIN_ROLES))
    .withMessage(VALIDATION_MESSAGES.INVALID_ROLE)
];

export const adminUpdateValidator = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .trim()
    .escape(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(VALIDATION_MESSAGES.PASSWORD_COMPLEXITY),
  
  body('role')
    .optional()
    .isIn(Object.values(ADMIN_ROLES))
    .withMessage(VALIDATION_MESSAGES.INVALID_ROLE)
];