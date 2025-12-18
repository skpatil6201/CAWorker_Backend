import { body } from 'express-validator';
import { VALIDATION_MESSAGES, GENDER_TYPES, EXPERIENCE_LEVELS } from '../utils/constants';

export const candidateRegistrationValidator = [
  body('fullName')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('Full name'))
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
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
  
  body('mobileNumber')
    .isMobilePhone('en-IN')
    .withMessage(VALIDATION_MESSAGES.INVALID_PHONE)
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be exactly 10 digits'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage(VALIDATION_MESSAGES.INVALID_DATE)
    .custom((value) => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        throw new Error('Candidate must be at least 18 years old');
      }
      return true;
    }),
  
  body('gender')
    .isIn(Object.values(GENDER_TYPES))
    .withMessage(VALIDATION_MESSAGES.INVALID_GENDER),
  
  body('address')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('Address'))
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters')
    .trim()
    .escape(),
  
  body('highestQualification')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('Highest qualification'))
    .isLength({ max: 200 })
    .withMessage('Highest qualification must not exceed 200 characters')
    .trim()
    .escape(),
  
  body('certifications')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Certifications must not exceed 1000 characters')
    .trim()
    .escape(),
  
  body('yearsOfExperience')
    .isIn(Object.values(EXPERIENCE_LEVELS))
    .withMessage(VALIDATION_MESSAGES.INVALID_EXPERIENCE),
  
  body('currentPreviousEmployer')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Employer name must not exceed 200 characters')
    .trim()
    .escape(),
  
  body('positionHeld')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Position must not exceed 200 characters')
    .trim()
    .escape(),
  
  body('areasOfExpertise')
    .optional()
    .isArray()
    .withMessage('Areas of expertise must be an array'),
  
  body('softwareProficiency')
    .optional()
    .isArray()
    .withMessage('Software proficiency must be an array'),
  
  body('otherSoftware')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Other software must not exceed 500 characters')
    .trim()
    .escape(),
  
  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array')
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