"# S K ASSOCIATES - CA Worker Backend API

A comprehensive backend API for managing CA (Chartered Accountant) workers and firms registration system.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Password Security**: Bcrypt password hashing
- **Input Validation**: Express-validator for request validation
- **Error Handling**: Centralized error handling with consistent API responses
- **CORS Support**: Configurable CORS for frontend integration
- **Environment Configuration**: Environment-based configuration

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Development**: nodemon, ts-node

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```env
PORT=8080
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/candidates/register` - Register new candidate
- `POST /api/candidates/login` - Candidate login
- `POST /api/firms/register` - Register new firm
- `POST /api/firms/login` - Firm login
- `POST /api/admins/login` - Admin login

### Candidates (Protected)
- `GET /api/candidates` - Get all candidates (Admin only)
- `GET /api/candidates/:id` - Get candidate by ID (Admin only)
- `GET /api/candidates/profile/me` - Get own profile (Authenticated candidate)
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate (Admin only)

### Firms (Protected)
- `GET /api/firms` - Get all firms (Admin only)
- `GET /api/firms/:id` - Get firm by ID (Admin only)
- `GET /api/firms/profile/me` - Get own profile (Authenticated firm)
- `PUT /api/firms/:id` - Update firm
- `DELETE /api/firms/:id` - Delete firm (Admin only)

### Admin (Protected)
- `GET /api/admins` - Get all admins (SuperAdmin only)
- `POST /api/admins` - Create new admin (SuperAdmin only)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `PUT /api/candidates/:id/status` - Update candidate status
- `PUT /api/firms/:id/status` - Update firm status

### System
- `GET /` - API status and information
- `GET /health` - Health check endpoint

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **SuperAdmin**: Full system access
- **Admin**: Can manage candidates and firms
- **Candidate**: Can manage own profile
- **Firm**: Can manage own profile

## Default Admin Account

- **Username**: admin
- **Email**: admin@skassociates.com
- **Password**: admin123

## API Response Format

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

## Development

The server includes:
- Hot reloading with nodemon
- TypeScript compilation
- Input validation
- Error handling middleware
- CORS configuration
- Environment-based configuration

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Role-based access control
- CORS protection
- Request size limits" 
