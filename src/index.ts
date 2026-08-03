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
const normalizeOrigin = (origin: string) => origin.trim().replace(/\/$/, '');
const parseOriginList = (value?: string) =>
  value?.split(',').map(item => normalizeOrigin(item)).filter(Boolean) ?? [];

const getDefaultOrigins = () => [
  'http://localhost:5178',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5170',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'https://worker-client-kjzm.vercel.app',
  'https://worker-client-one.vercel.app'
].map(normalizeOrigin);

const isAllowedOrigin = (origin: string | undefined, effectiveOrigins: string[]) => {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  return effectiveOrigins.includes(normalizedOrigin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin);
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const defaultOrigins = getDefaultOrigins();
    const allowedEnv = parseOriginList(process.env.ALLOWED_ORIGINS);
    const deniedEnv = parseOriginList(process.env.DENIED_ORIGINS);

    const allowAll = allowedEnv.includes('*');
    const effectiveAllowed = allowAll ? defaultOrigins : Array.from(new Set([...allowedEnv, ...defaultOrigins]));

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);

    if (deniedEnv.includes(normalizedOrigin)) {
      console.log(`CORS denied origin: ${normalizedOrigin}`);
      return callback(new Error('Not allowed by CORS'), false);
    }

    if (isAllowedOrigin(origin, effectiveAllowed)) {
      return callback(null, true);
    }

    console.log(`CORS blocked origin: ${normalizedOrigin}`);
    console.log(`Allowed origins: ${effectiveAllowed.join(', ')}`);
    callback(new Error('Not allowed by CORS'), false);
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
