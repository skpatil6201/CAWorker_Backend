"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const firm_routes_1 = __importDefault(require("./routes/firm.routes"));
const candidate_routes_1 = __importDefault(require("./routes/candidate.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const response_1 = require("./utils/response");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Routes
app.use("/api", user_routes_1.default);
app.use("/api", firm_routes_1.default);
app.use("/api", candidate_routes_1.default);
app.use("/api", admin_routes_1.default);
// Root route
app.get("/", (req, res) => {
    (0, response_1.sendSuccess)(res, "S K ASSOCIATES - CA Worker API Server is running", {
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});
// Health check route
app.get("/health", (req, res) => {
    (0, response_1.sendSuccess)(res, "Server is healthy", {
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
// 404 handler
app.use("*", (req, res) => {
    (0, response_1.sendError)(res, "Route not found", `Cannot ${req.method} ${req.originalUrl}`, 404);
});
// Global error handler
app.use((error, req, res, next) => {
    console.error("Global error:", error);
    (0, response_1.sendError)(res, "Internal server error", error.message, 500);
});
// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
