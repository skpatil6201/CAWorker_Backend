"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firmLoginValidator = exports.firmRegistrationValidator = void 0;
const express_validator_1 = require("express-validator");
exports.firmRegistrationValidator = [
    (0, express_validator_1.body)('firmName')
        .notEmpty()
        .withMessage('Firm name is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Firm name must be between 2 and 200 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    (0, express_validator_1.body)('registrationNumber')
        .notEmpty()
        .withMessage('Registration number is required'),
    (0, express_validator_1.body)('dateOfRegistration')
        .isISO8601()
        .withMessage('Please provide a valid registration date'),
    (0, express_validator_1.body)('panGstNumber')
        .notEmpty()
        .withMessage('PAN/GST number is required')
        .isLength({ min: 10, max: 15 })
        .withMessage('PAN/GST number must be between 10 and 15 characters'),
    (0, express_validator_1.body)('firmType')
        .isIn(['Partnership', 'LLP', 'Private Ltd', 'Others'])
        .withMessage('Firm type must be one of: Partnership, LLP, Private Ltd, Others'),
    (0, express_validator_1.body)('headOfficeAddress')
        .notEmpty()
        .withMessage('Head office address is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Address must be between 10 and 500 characters'),
    (0, express_validator_1.body)('cityStatePin')
        .notEmpty()
        .withMessage('City, State, PIN is required'),
    (0, express_validator_1.body)('firmContactNumber')
        .isMobilePhone('en-IN')
        .withMessage('Please provide a valid Indian contact number'),
    (0, express_validator_1.body)('partners')
        .isArray({ min: 1 })
        .withMessage('At least one partner is required'),
    (0, express_validator_1.body)('partners.*.name')
        .notEmpty()
        .withMessage('Partner name is required'),
    (0, express_validator_1.body)('partners.*.qualification')
        .notEmpty()
        .withMessage('Partner qualification is required'),
    (0, express_validator_1.body)('partners.*.membershipNo')
        .notEmpty()
        .withMessage('Partner membership number is required')
];
exports.firmLoginValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
