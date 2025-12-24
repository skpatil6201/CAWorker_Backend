# S K ASSOCIATES - CA Worker Backend API

A comprehensive, production-ready backend API for managing CA (Chartered Accountant) workers and firms registration system with advanced security, validation, and monitoring features.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Password Security**: Bcrypt password hashing with configurable salt rounds
- **Input Validation**: Comprehensive express-validator with custom validation rules
- **Error Handling**: Centralized error handling with consistent API responses
- **CORS Support**: Configurable CORS for frontend integration
- **Environment Configuration**: Environment-based configuration management

### Security Features
- **Rate Limiting**: Configurable rate limiting to prevent abuse
- **Security Headers**: Comprehensive security headers (HSTS, CSP, etc.)
- **Request Size Limiting**: Configurable request size limits
- **Input Sanitization**: XSS and injection prevention
- **JWT Security**: Secure token generation with issuer/audience validation
- **Password Complexity**: Enforced password complexity rules

### Monitoring & Logging
- **Structured Logging**: Comprehensive logging with different levels
- **Health Checks**: Detailed health check endpoints
- **Request Logging**: Automatic request/response logging
- **Error Tracking**: Detailed error tracking and reporting

### Data Management
- **In-Memory Storage**: Fast in-memory data storage (easily replaceable with database)
- **Data Validation**: Comprehensive data validation and sanitization
- **Status Management**: Approval workflow for candidates and firms
- **Dashboard Analytics**: Real-time statistics and analytics

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator with custom validators
- **Development**: nodemon, ts-node, rimraf
- **Security**: Custom security middleware

## 📦 Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd server
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

3. **Update the `.env` file with your configuration:**
```env
# Server Configuration
PORT=8080
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRES_IN=7d

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Available Scripts
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm run start      # Start production server
npm run clean      # Clean build directory
npm run lint       # Run linting (placeholder)
npm run test       # Run tests (placeholder)
```

## 📚 API Documentation

### Quick Start URLs
- **API Base**: `https://caworker-backend-1.onrender.com/api`
- **Health Check**: `https://caworker-backend-1.onrender.com/health`
- **API Info**: `https://caworker-backend-1.onrender.com/api`

### Complete Documentation
See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for comprehensive API documentation including:
- All endpoints with request/response examples
- Authentication and authorization details
- Data models and validation rules
- Error handling and status codes
- Rate limiting and security features

## 🔐 Authentication & Authorization

### User Roles
- **SuperAdmin**: Full system access, can manage all resources
- **Admin**: Can manage candidates and firms, view analytics
- **Candidate**: Can manage own profile and registration
- **Firm**: Can manage own profile and registration

### Default Admin Account
```json
{
  "username": "admin",
  "email": "admin@skassociates.com",
  "password": "admin123",
  "role": "SuperAdmin"
}
```

### JWT Token Usage
```http
Authorization: Bearer <your_jwt_token>
```

## 📊 API Response Format

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

## 🧪 Testing

### Manual Testing
Use the provided test script to verify all endpoints:
```bash
node test-api.js
```

### API Testing Tools
- **Postman**: Import the API collection (can be generated from documentation)
- **curl**: Use curl commands from the documentation
- **Thunder Client**: VS Code extension for API testing

## 🔒 Security Features

### Rate Limiting
- **Default**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Configurable**: Via environment variables

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'self'`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### Input Validation
- **Email**: RFC compliant email validation
- **Phone**: Indian mobile number validation
- **Password**: Complexity requirements (min 6 chars, uppercase, lowercase, number)
- **Dates**: ISO 8601 format with business logic validation
- **Arrays**: Non-empty array validation for required fields
- **Sanitization**: XSS prevention and input sanitization

## 📈 Monitoring & Analytics

### Health Check Endpoint
```http
GET /health
```
Returns server status, uptime, memory usage, and version information.

### Dashboard Statistics
```http
GET /api/dashboard/stats
```
Returns real-time statistics for candidates, firms, and approval status.

### Logging
- **Request Logging**: All requests are logged with IP, user agent, and timestamp
- **Error Logging**: Detailed error logging with stack traces
- **Security Logging**: Rate limit violations and security events

## 🏗 Architecture

### Project Structure
```
server/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # Route definitions
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validation
│   └── index.ts         # Main server file
├── dist/                # Compiled JavaScript
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

### Key Components
- **Models**: In-memory data storage with CRUD operations
- **Controllers**: Business logic and request handling
- **Middleware**: Authentication, validation, security, logging
- **Validators**: Input validation and sanitization
- **Utils**: Helper functions for auth, logging, constants

## 🔄 Data Flow

1. **Request** → Security Middleware → Rate Limiting → CORS
2. **Routing** → Authentication → Authorization → Validation
3. **Controller** → Business Logic → Model Operations
4. **Response** → Error Handling → Logging → Client

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure secure JWT secret (minimum 32 characters)
3. Set up proper CORS origins
4. Configure rate limiting for production load
5. Set up proper logging and monitoring

### Production Considerations
- Use a proper database instead of in-memory storage
- Set up SSL/TLS certificates
- Configure reverse proxy (nginx/Apache)
- Set up monitoring and alerting
- Implement backup and recovery procedures
- Use environment-specific configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Refer to the API documentation

## 🔮 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- File upload handling for documents
- Email notifications for status changes
- Advanced search and filtering
- API versioning
- Comprehensive test suite
- Docker containerization
- CI/CD pipeline setup
