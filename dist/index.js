"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const firm_routes_1 = __importDefault(require("./routes/firm.routes"));
const candidate_routes_1 = __importDefault(require("./routes/candidate.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const response_1 = require("./utils/response");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Connect to MongoDB
(0, database_1.default)();
// CORS middleware
app.use((req, res, next) => {
    var _a;
    const allowedOrigins = ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['http://localhost:5173', 'http://localhost:5174'];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use("/api", user_routes_1.default);
app.use("/api", firm_routes_1.default);
app.use("/api", candidate_routes_1.default);
app.use("/api", admin_routes_1.default);
app.use("/api", job_routes_1.default);
app.use("/api", application_routes_1.default);
app.get("/", (req, res) => {
    (0, response_1.sendSuccess)(res, "S K ASSOCIATES - CA Worker API Server is running");
});
app.get("/health", (req, res) => {
    const healthData = {
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        version: process.version
    };
    (0, response_1.sendSuccess)(res, "Server is healthy", healthData);
});
app.get("/api", (req, res) => {
    (0, response_1.sendSuccess)(res, "S K ASSOCIATES - CA Worker API", {
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
