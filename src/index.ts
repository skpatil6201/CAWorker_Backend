import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import userRoutes from "./routes/user.routes";
import firmRoutes from "./routes/firm.routes";
import candidateRoutes from "./routes/candidate.routes";
import adminRoutes from "./routes/admin.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";
import galleryRoutes from "./routes/gallery.routes";
import serviceRoutes from "./routes/service.routes";
import { sendSuccess } from "./utils/response";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const defaultOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://worker-client-kjzm.vercel.app',
      'https://worker-client-one.vercel.app'
    ];
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? [...process.env.ALLOWED_ORIGINS.split(','), ...defaultOrigins]
      : defaultOrigins;
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight for all routes

// Body parsing middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use("/api", userRoutes);
app.use("/api", firmRoutes);
app.use("/api", candidateRoutes);
app.use("/api", adminRoutes);
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/services", serviceRoutes);

app.get("/", (req: Request, res: Response) => {
  sendSuccess(res, "S K ASSOCIATES - CA Worker API Server is running");
});

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

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
  console.log(`❤️  Health Check: http://localhost:${port}/health`);
});
