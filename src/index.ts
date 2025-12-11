import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import firmRoutes from "./routes/firm.routes";
import candidateRoutes from "./routes/candidate.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", firmRoutes);
app.use("/api", candidateRoutes);
app.use("/api", adminRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("S K ASSOCIATES - CA Worker API Server");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
