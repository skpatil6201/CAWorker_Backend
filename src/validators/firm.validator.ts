import { body } from 'express-validator';

export const firmRegistrationValidator = [
  body('firmName')
    .notEmpty()
    .withMessage('Firm name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Firm name must be between 2 and 200 characters'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('registrationNumber')
    .notEmpty()
    .withMessage('Registration number is required'),

  body('dateOfRegistration')
    .isISO8601()
    .withMessage('Please provide a valid registration date'),

  body('panGstNumber')
    .notEmpty()
    .withMessage('PAN/GST number is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('PAN/GST number must be between 10 and 15 characters'),

  body('firmType')
    .isIn(['Partnership', 'LLP', 'Private Ltd', 'Others'])
    .withMessage('Firm type must be one of: Partnership, LLP, Private Ltd, Others'),

  body('headOfficeAddress')
    .notEmpty()
    .withMessage('Head office address is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),

  body('cityStatePin')
    .notEmpty()
    .withMessage('City, State, PIN is required'),

  body('firmContactNumber')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian contact number'),

  body('partners')
    .isArray({ min: 1 })
    .withMessage('At least one partner is required'),

  body('partners.*.name')
    .notEmpty()
    .withMessage('Partner name is required'),

  body('partners.*.qualification')
    .notEmpty()
    .withMessage('Partner qualification is required'),

  body('partners.*.membershipNo')
    .notEmpty()
    .withMessage('Partner membership number is required')
];

export const firmLoginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];