import { GENDER_TYPES, EXPERIENCE_LEVELS, FIRM_TYPES, STATUS_TYPES, ADMIN_ROLES } from './constants';

export class ValidationUtils {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Indian mobile number validation
  static isValidIndianMobile(mobile: string): boolean {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\D/g, ''));
  }

  // Password strength validation
  static isValidPassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
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
  static isValidPAN(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  }

  // GST number validation
  static isValidGST(gst: string): boolean {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  }

  // Date validation
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  // Age validation (minimum 18 years)
  static isValidAge(dateOfBirth: string, minAge: number = 18): boolean {
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
  static isValidGender(gender: string): boolean {
    return Object.values(GENDER_TYPES).includes(gender as any);
  }

  static isValidExperience(experience: string): boolean {
    return Object.values(EXPERIENCE_LEVELS).includes(experience as any);
  }

  static isValidFirmType(firmType: string): boolean {
    return Object.values(FIRM_TYPES).includes(firmType as any);
  }

  static isValidStatus(status: string): boolean {
    return Object.values(STATUS_TYPES).includes(status as any);
  }

  static isValidAdminRole(role: string): boolean {
    return Object.values(ADMIN_ROLES).includes(role as any);
  }

  // Array validation
  static isNonEmptyArray(arr: any): boolean {
    return Array.isArray(arr) && arr.length > 0;
  }

  // String validation
  static isNonEmptyString(str: any): boolean {
    return typeof str === 'string' && str.trim().length > 0;
  }

  // Number validation
  static isValidId(id: any): boolean {
    const numId = parseInt(id);
    return !isNaN(numId) && numId > 0;
  }

  // File extension validation
  static isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedExtensions.includes(extension) : false;
  }

  // Sanitize input
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  // Validate partner object
  static isValidPartner(partner: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
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
    } else if (!this.isValidIndianMobile(partner.contact)) {
      errors.push('Partner contact must be a valid Indian mobile number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}