import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import userRoutes from "./routes/user.routes";
import firmRoutes from "./routes/firm.routes";
import candidateRoutes from "./routes/candidate.routes";
import adminRoutes from "./routes/admin.routes";
import { sendSuccess } from "./utils/response";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api", userRoutes);
app.use("/api", firmRoutes);
app.use("/api", candidateRoutes);
app.use("/api", adminRoutes);

app.get("/", (req: Request, res: Response) => {
  sendSuccess(res, "S K ASSOCIATES - CA Worker API Server is running", {
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
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

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
  console.log(`❤️  Health Check: http://localhost:${port}/health`);
});
