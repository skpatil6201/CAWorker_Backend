import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import firmRoutes from "./routes/firm.routes";
import candidateRoutes from "./routes/candidate.routes";
import adminRoutes from "./routes/admin.routes";
import { sendSuccess, sendError } from "./utils/response";
import { Logger } from "./utils/logger";
import { HTTP_STATUS, ERROR_MESSAGES } from "./utils/constants";
import { rateLimit, securityHeaders, requestSizeLimiter } from "./middleware/security.middleware";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// CORS middleware - must be before other middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
      : [
          'http://localhost:3000', 
          'http://localhost:5173', 
          'http://127.0.0.1:3000', 
          'http://127.0.0.1:5173',
          'http://localhost:5174',
          'http://127.0.0.1:5174'
        ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      Logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false
}));

// Security middleware
app.use(securityHeaders);
app.use(rateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
));
app.use(requestSizeLimiter('10mb'));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  Logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent')
  });
  next();
});

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  type: 'application/json'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// API Routes
app.use("/api", userRoutes);
app.use("/api", firmRoutes);
app.use("/api", candidateRoutes);
app.use("/api", adminRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  sendSuccess(res, "S K ASSOCIATES - CA Worker API Server is running", {
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Health check route
app.get("/health", (req: Request, res: Response) => {
  const healthData = {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    version: process.version
  };
  
  sendSuccess(res, "Server is healthy", healthData);
});

// API documentation route
app.get("/api", (req: Request, res: Response) => {
  sendSuccess(res, "S K ASSOCIATES - CA Worker API", {
    version: "1.0.0",
    endpoints: {
      candidates: "/api/candidates",
      firms: "/api/firms",
      admins: "/api/admins",
      users: "/api/users"
    },
    documentation: "See README.md for detailed API documentation"
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  Logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  sendError(res, "Route not found", `Cannot ${req.method} ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND);
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  Logger.error("Global error occurred", {
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  // Don't leak error details in production
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? ERROR_MESSAGES.INTERNAL_ERROR 
    : error.message;
    
  sendError(res, ERROR_MESSAGES.INTERNAL_ERROR, errorMessage, HTTP_STATUS.INTERNAL_SERVER_ERROR);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(port, () => {
  Logger.info(`Server started successfully`, {
    port,
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version
  });
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
  console.log(`❤️  Health Check: http://localhost:${port}/health`);
});
