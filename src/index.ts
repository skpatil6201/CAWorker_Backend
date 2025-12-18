import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import firmRoutes from "./routes/firm.routes";
import candidateRoutes from "./routes/candidate.routes";
import adminRoutes from "./routes/admin.routes";
import { sendSuccess, sendError } from "./utils/response";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api", userRoutes);
app.use("/api", firmRoutes);
app.use("/api", candidateRoutes);
app.use("/api", adminRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  sendSuccess(res, "S K ASSOCIATES - CA Worker API Server is running", {
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/health", (req: Request, res: Response) => {
  sendSuccess(res, "Server is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  sendError(res, "Route not found", `Cannot ${req.method} ${req.originalUrl}`, 404);
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error("Global error:", error);
  sendError(res, "Internal server error", error.message, 500);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
