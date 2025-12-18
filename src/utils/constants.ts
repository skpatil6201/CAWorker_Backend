export const USER_TYPES = {
  CANDIDATE: 'candidate',
  FIRM: 'firm',
  ADMIN: 'admin'
} as const;

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin'
} as const;

export const STATUS_TYPES = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
} as const;

export const GENDER_TYPES = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other'
} as const;

export const EXPERIENCE_LEVELS = {
  ENTRY: '0-1',
  JUNIOR: '1-3',
  MID: '3-5',
  SENIOR: '5+'
} as const;

export const FIRM_TYPES = {
  PARTNERSHIP: 'Partnership',
  LLP: 'LLP',
  PRIVATE_LTD: 'Private Ltd',
  OTHERS: 'Others'
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PHONE: 'Please provide a valid Indian mobile number',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
  PASSWORD_COMPLEXITY: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  INVALID_DATE: 'Please provide a valid date',
  INVALID_GENDER: 'Gender must be Male, Female, or Other',
  INVALID_EXPERIENCE: 'Years of experience must be one of: 0-1, 1-3, 3-5, 5+',
  INVALID_FIRM_TYPE: 'Firm type must be one of: Partnership, LLP, Private Ltd, Others',
  INVALID_STATUS: 'Status must be Pending, Approved, or Rejected',
  INVALID_ROLE: 'Role must be either SuperAdmin or Admin'
} as const;

export const SUCCESS_MESSAGES = {
  REGISTERED: 'Registration successful',
  LOGIN: 'Login successful',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  RETRIEVED: 'Retrieved successfully',
  STATUS_UPDATED: 'Status updated successfully'
} as const;

export const ERROR_MESSAGES = {
  ALREADY_EXISTS: 'Already exists with this email',
  INVALID_CREDENTIALS: 'Invalid credentials',
  NOT_FOUND: 'Not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Insufficient permissions',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_REQUIRED: 'Access token required'
} as const;