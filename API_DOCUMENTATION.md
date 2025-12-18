# S K ASSOCIATES - CA Worker API Documentation

## Overview

This is a comprehensive REST API for managing CA (Chartered Accountant) workers and firms registration system. The API provides authentication, authorization, and CRUD operations for candidates, firms, and administrative functions.

## Base URL

- **Development**: `http://localhost:8080/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- **Window**: 15 minutes
- **Limit**: 100 requests per window per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: When the rate limit resets

## Endpoints

### System Endpoints

#### Get API Information
```http
GET /
```

#### Health Check
```http
GET /health
```

#### API Documentation
```http
GET /api
```

### Candidate Endpoints

#### Register Candidate
```http
POST /api/candidates/register
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "password": "Password123",
  "address": "123 Main Street, City, State",
  "highestQualification": "CA",
  "certifications": "CPA, ACCA",
  "yearsOfExperience": "3-5",
  "currentPreviousEmployer": "ABC Company",
  "positionHeld": "Senior Accountant",
  "areasOfExpertise": ["Taxation", "Auditing"],
  "softwareProficiency": ["Tally", "SAP"],
  "otherSoftware": "QuickBooks",
  "documents": ["resume.pdf", "certificates.pdf"]
}
```

#### Login Candidate
```http
POST /api/candidates/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get All Candidates (Admin Only)
```http
GET /api/candidates
Authorization: Bearer <admin_token>
```

#### Get Candidate by ID (Admin Only)
```http
GET /api/candidates/:id
Authorization: Bearer <admin_token>
```

#### Get Candidate Profile (Self)
```http
GET /api/candidates/profile/me
Authorization: Bearer <candidate_token>
```

#### Update Candidate
```http
PUT /api/candidates/:id
Authorization: Bearer <token>
```

#### Delete Candidate (Admin Only)
```http
DELETE /api/candidates/:id
Authorization: Bearer <admin_token>
```

### Firm Endpoints

#### Register Firm
```http
POST /api/firms/register
```

**Request Body:**
```json
{
  "firmName": "ABC Associates",
  "registrationNumber": "REG123456",
  "dateOfRegistration": "2020-01-01",
  "panGstNumber": "ABCDE1234F",
  "firmType": "Partnership",
  "firmTypeOther": "",
  "headOfficeAddress": "123 Business Street, City",
  "cityStatePin": "Mumbai, Maharashtra, 400001",
  "firmContactNumber": "9876543210",
  "email": "info@abcassociates.com",
  "password": "Password123",
  "website": "https://abcassociates.com",
  "partners": [
    {
      "name": "Partner Name",
      "qualification": "CA",
      "membershipNo": "123456",
      "designation": "Managing Partner",
      "contact": "9876543210"
    }
  ],
  "areasOfPractice": ["Taxation", "Auditing"],
  "otherPracticeArea": "Corporate Law",
  "documents": ["registration.pdf", "pan.pdf"]
}
```

#### Login Firm
```http
POST /api/firms/login
```

**Request Body:**
```json
{
  "email": "info@abcassociates.com",
  "password": "Password123"
}
```

#### Get All Firms (Admin Only)
```http
GET /api/firms
Authorization: Bearer <admin_token>
```

#### Get Firm by ID (Admin Only)
```http
GET /api/firms/:id
Authorization: Bearer <admin_token>
```

#### Get Firm Profile (Self)
```http
GET /api/firms/profile/me
Authorization: Bearer <firm_token>
```

#### Update Firm
```http
PUT /api/firms/:id
Authorization: Bearer <token>
```

#### Delete Firm (Admin Only)
```http
DELETE /api/firms/:id
Authorization: Bearer <admin_token>
```

### Admin Endpoints

#### Login Admin
```http
POST /api/admins/login
```

**Request Body:**
```json
{
  "email": "admin@skassociates.com",
  "password": "admin123"
}
```

Or with username:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### Get All Admins (SuperAdmin Only)
```http
GET /api/admins
Authorization: Bearer <superadmin_token>
```

#### Get Admin by ID (SuperAdmin Only)
```http
GET /api/admins/:id
Authorization: Bearer <superadmin_token>
```

#### Create Admin (SuperAdmin Only)
```http
POST /api/admins
Authorization: Bearer <superadmin_token>
```

**Request Body:**
```json
{
  "username": "newadmin",
  "email": "newadmin@skassociates.com",
  "password": "Password123",
  "role": "Admin"
}
```

#### Update Admin (SuperAdmin Only)
```http
PUT /api/admins/:id
Authorization: Bearer <superadmin_token>
```

#### Delete Admin (SuperAdmin Only)
```http
DELETE /api/admins/:id
Authorization: Bearer <superadmin_token>
```

#### Get Dashboard Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalCandidates": 150,
    "pendingCandidates": 25,
    "approvedCandidates": 100,
    "rejectedCandidates": 25,
    "totalFirms": 50,
    "pendingFirms": 10,
    "approvedFirms": 35,
    "rejectedFirms": 5
  }
}
```

#### Update Candidate Status
```http
PUT /api/candidates/:id/status
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "Approved"
}
```

#### Update Firm Status
```http
PUT /api/firms/:id/status
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "Approved"
}
```

### User Endpoints (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <admin_token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <admin_token>
```

#### Create User (SuperAdmin Only)
```http
POST /api/users
Authorization: Bearer <superadmin_token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <admin_token>
```

#### Delete User (SuperAdmin Only)
```http
DELETE /api/users/:id
Authorization: Bearer <superadmin_token>
```

## Data Models

### Candidate
```typescript
interface Candidate {
  id: number;
  fullName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  mobileNumber: string;
  email: string;
  password: string; // Hashed
  address: string;
  highestQualification: string;
  certifications: string;
  yearsOfExperience: "0-1" | "1-3" | "3-5" | "5+";
  currentPreviousEmployer: string;
  positionHeld: string;
  areasOfExpertise: string[];
  softwareProficiency: string[];
  otherSoftware?: string;
  documents: string[];
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
}
```

### Firm
```typescript
interface Firm {
  id: number;
  firmName: string;
  registrationNumber: string;
  dateOfRegistration: string;
  panGstNumber: string;
  firmType: "Partnership" | "LLP" | "Private Ltd" | "Others";
  firmTypeOther?: string;
  headOfficeAddress: string;
  cityStatePin: string;
  firmContactNumber: string;
  email: string;
  password: string; // Hashed
  website?: string;
  partners: Partner[];
  areasOfPractice: string[];
  otherPracticeArea?: string;
  documents: string[];
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
}
```

### Partner
```typescript
interface Partner {
  name: string;
  qualification: string;
  membershipNo: string;
  designation: string;
  contact: string;
}
```

### Admin
```typescript
interface Admin {
  id: number;
  username: string;
  email: string;
  password: string; // Hashed
  role: "SuperAdmin" | "Admin";
  createdAt: Date;
}
```

## User Roles & Permissions

### SuperAdmin
- Full system access
- Can manage all admins, candidates, and firms
- Can create/delete other admins
- Can access all endpoints

### Admin
- Can manage candidates and firms
- Can view dashboard statistics
- Can approve/reject registrations
- Cannot manage other admins

### Candidate
- Can manage own profile
- Can register and login
- Limited access to own data

### Firm
- Can manage own profile
- Can register and login
- Limited access to own data

## Default Admin Account

- **Username**: `admin`
- **Email**: `admin@skassociates.com`
- **Password**: `admin123`
- **Role**: `SuperAdmin`

## Validation Rules

### Password Requirements
- Minimum 6 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number

### Email
- Valid email format
- Maximum 255 characters
- Unique across the system

### Mobile Number
- Valid Indian mobile number format
- Exactly 10 digits
- Must start with 6, 7, 8, or 9

### Date Validation
- ISO 8601 format (YYYY-MM-DD)
- Date of birth: Minimum age 18 years
- Registration date: Cannot be in future

## Error Handling

The API provides comprehensive error handling with detailed error messages and appropriate HTTP status codes. All errors follow the standard error response format.

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers
- Request size limits
- SQL injection prevention
- XSS protection

## Environment Variables

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com

# Security
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Development

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## Support

For API support and questions, please contact the development team or refer to the project repository.