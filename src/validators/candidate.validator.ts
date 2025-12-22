import { body } from 'express-validator';

export const candidateRegistrationValidator = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('mobileNumber')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian mobile number'),

  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),

  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),

  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),

  body('highestQualification')
    .notEmpty()
    .withMessage('Highest qualification is required'),

  body('yearsOfExperience')
    .isIn(['0-1', '1-3', '3-5', '5+'])
    .withMessage('Years of experience must be one of: 0-1, 1-3, 3-5, 5+')
];

export const candidateLoginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];