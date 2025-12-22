"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUtils = void 0;
const constants_1 = require("./constants");
class ValidationUtils {
    // Email validation
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // Indian mobile number validation
    static isValidIndianMobile(mobile) {
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(mobile.replace(/\D/g, ''));
    }
    // Password strength validation
    static isValidPassword(password) {
        const errors = [];
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // PAN number validation
    static isValidPAN(pan) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan.toUpperCase());
    }
    // GST number validation
    static isValidGST(gst) {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst.toUpperCase());
    }
    // Date validation
    static isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }
    // Age validation (minimum 18 years)
    static isValidAge(dateOfBirth, minAge = 18) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= minAge;
        }
        return age >= minAge;
    }
    // Enum validation helpers
    static isValidGender(gender) {
        return Object.values(constants_1.GENDER_TYPES).includes(gender);
    }
    static isValidExperience(experience) {
        return Object.values(constants_1.EXPERIENCE_LEVELS).includes(experience);
    }
    static isValidFirmType(firmType) {
        return Object.values(constants_1.FIRM_TYPES).includes(firmType);
    }
    static isValidStatus(status) {
        return Object.values(constants_1.STATUS_TYPES).includes(status);
    }
    static isValidAdminRole(role) {
        return Object.values(constants_1.ADMIN_ROLES).includes(role);
    }
    // Array validation
    static isNonEmptyArray(arr) {
        return Array.isArray(arr) && arr.length > 0;
    }
    // String validation
    static isNonEmptyString(str) {
        return typeof str === 'string' && str.trim().length > 0;
    }
    // Number validation
    static isValidId(id) {
        const numId = parseInt(id);
        return !isNaN(numId) && numId > 0;
    }
    // File extension validation
    static isValidFileExtension(filename, allowedExtensions) {
        var _a;
        const extension = (_a = filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        return extension ? allowedExtensions.includes(extension) : false;
    }
    // Sanitize input
    static sanitizeString(input) {
        return input.trim().replace(/[<>]/g, '');
    }
    // Validate partner object
    static isValidPartner(partner) {
        const errors = [];
        if (!this.isNonEmptyString(partner.name)) {
            errors.push('Partner name is required');
        }
        if (!this.isNonEmptyString(partner.qualification)) {
            errors.push('Partner qualification is required');
        }
        if (!this.isNonEmptyString(partner.membershipNo)) {
            errors.push('Partner membership number is required');
        }
        if (!this.isNonEmptyString(partner.designation)) {
            errors.push('Partner designation is required');
        }
        if (!this.isNonEmptyString(partner.contact)) {
            errors.push('Partner contact is required');
        }
        else if (!this.isValidIndianMobile(partner.contact)) {
            errors.push('Partner contact must be a valid Indian mobile number');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
exports.ValidationUtils = ValidationUtils;
