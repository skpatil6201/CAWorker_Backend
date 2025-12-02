import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("CA Worker API Server");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
