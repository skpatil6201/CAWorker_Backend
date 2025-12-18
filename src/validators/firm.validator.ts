import { body } from 'express-validator';
import { VALIDATION_MESSAGES, FIRM_TYPES } from '../utils/constants';

export const firmRegistrationValidator = [
  body('firmName')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('Firm name'))
    .isLength({ min: 2, max: 200 })
    .withMessage('Firm name must be between 2 and 200 characters')
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
  
  body('registrationNumber')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('Registration number'))
    .isLength({ min: 5, max: 50 })
    .withMessage('Registration number must be between 5 and 50 characters')
    .trim()
    .escape(),
  
  body('dateOfRegistration')
    .isISO8601()
    .withMessage(VALIDATION_MESSAGES.INVALID_DATE)
    .custom((value) => {
      const regDate = new Date(value);
      const today = new Date();
      if (regDate > today) {
        throw new Error('Registration date cannot be in the future');
      }
      return true;
    }),
  
  body('panGstNumber')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('PAN/GST number'))
    .isLength({ min: 10, max: 15 })
    .withMessage('PAN/GST number must be between 10 and 15 characters')
    .trim()
    .toUpperCase(),
  
  body('firmType')
    .isIn(Object.values(FIRM_TYPES))
    .withMessage(VALIDATION_MESSAGES.INVALID_FIRM_TYPE),
  
  body('firmTypeOther')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Other firm type must not exceed 100 characters')
    .trim()
    .escape(),
  
  body('headOfficeAddress')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('Head office address'))
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters')
    .trim()
    .escape(),
  
  body('cityStatePin')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('City, State, PIN'))
    .isLength({ min: 5, max: 100 })
    .withMessage('City, State, PIN must be between 5 and 100 characters')
    .trim()
    .escape(),
  
  body('firmContactNumber')
    .isMobilePhone('en-IN')
    .withMessage(VALIDATION_MESSAGES.INVALID_PHONE)
    .isLength({ min: 10, max: 10 })
    .withMessage('Contact number must be exactly 10 digits'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL')
    .isLength({ max: 255 })
    .withMessage('Website URL must not exceed 255 characters'),
  
  body('partners')
    .isArray({ min: 1 })
    .withMessage('At least one partner is required'),
  
  body('partners.*.name')
    .notEmpty()
    .withMessage('Partner name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Partner name must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('partners.*.qualification')
    .notEmpty()
    .withMessage('Partner qualification is required')
    .isLength({ max: 200 })
    .withMessage('Partner qualification must not exceed 200 characters')
    .trim()
    .escape(),
  
  body('partners.*.membershipNo')
    .notEmpty()
    .withMessage('Partner membership number is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Membership number must be between 3 and 50 characters')
    .trim()
    .escape(),
  
  body('partners.*.designation')
    .notEmpty()
    .withMessage('Partner designation is required')
    .isLength({ max: 100 })
    .withMessage('Partner designation must not exceed 100 characters')
    .trim()
    .escape(),
  
  body('partners.*.contact')
    .notEmpty()
    .withMessage('Partner contact is required')
    .isMobilePhone('en-IN')
    .withMessage('Partner contact must be a valid Indian mobile number'),
  
  body('areasOfPractice')
    .optional()
    .isArray()
    .withMessage('Areas of practice must be an array'),
  
  body('otherPracticeArea')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Other practice area must not exceed 500 characters')
    .trim()
    .escape(),
  
  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array')
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