"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const firm_routes_1 = __importDefault(require("./routes/firm.routes"));
const candidate_routes_1 = __importDefault(require("./routes/candidate.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const gallery_routes_1 = __importDefault(require("./routes/gallery.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const assignmentRequest_routes_1 = __importDefault(require("./routes/assignmentRequest.routes"));
const response_1 = require("./utils/response");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Connect to MongoDB
(0, database_1.default)();
// CORS configuration
const normalizeOrigin = (origin) => origin.trim().replace(/\/$/, '');
const parseOriginList = (value) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.split(',').map(item => normalizeOrigin(item)).filter(Boolean)) !== null && _a !== void 0 ? _a : []; };
const getDefaultOrigins = () => [
    'http://localhost:5178',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5170',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000',
    'http://98.92.213.207',
    'http://98.92.213.207:5173',
    'https://worker-client-kjzm.vercel.app',
    'https://worker-client-one.vercel.app'
].map(normalizeOrigin);
const getCorsConfig = () => {
    const allowedEnv = parseOriginList(process.env.ALLOWED_ORIGINS);
    const deniedOrigins = parseOriginList(process.env.DENIED_ORIGINS);
    const allowAll = allowedEnv.includes('*');
    const allowedOrigins = Array.from(new Set([
        ...allowedEnv.filter(origin => origin !== '*'),
        ...getDefaultOrigins()
    ]));
    return { allowAll, allowedOrigins, deniedOrigins };
};
const isAllowedOrigin = (origin, effectiveOrigins, allowAll = false) => {
    if (!origin)
        return true;
    if (allowAll)
        return true;
    const normalizedOrigin = normalizeOrigin(origin);
    return effectiveOrigins.includes(normalizedOrigin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin);
};
const resolveCorsOrigin = (origin) => {
    const { allowAll, allowedOrigins, deniedOrigins } = getCorsConfig();
    if (!origin)
        return '*';
    const normalizedOrigin = normalizeOrigin(origin);
    if (deniedOrigins.includes(normalizedOrigin)) {
        console.log(`CORS denied origin: ${normalizedOrigin}`);
        return false;
    }
    if (isAllowedOrigin(origin, allowedOrigins, allowAll)) {
        return origin;
    }
    console.log(`CORS blocked origin: ${normalizedOrigin}`);
    console.log(`Allowed origins: ${allowAll ? '*' : allowedOrigins.join(', ')}`);
    return false;
};
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (resolveCorsOrigin(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};
app.use((req, res, next) => {
    const origin = typeof req.headers.origin === 'string' ? req.headers.origin : undefined;
    const allowedOrigin = resolveCorsOrigin(origin);
    if (allowedOrigin) {
        res.header('Access-Control-Allow-Origin', allowedOrigin);
    }
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions)); // handle preflight for all routes
// Body parsing middleware
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
app.use("/api", user_routes_1.default);
app.use("/api", firm_routes_1.default);
app.use("/api", candidate_routes_1.default);
app.use("/api", admin_routes_1.default);
app.use("/api", job_routes_1.default);
app.use("/api", application_routes_1.default);
app.use("/api", assignmentRequest_routes_1.default);
app.use("/api/gallery", gallery_routes_1.default);
app.use("/api/services", service_routes_1.default);
app.get("/", (req, res) => {
    (0, response_1.sendSuccess)(res, "S K ASSOCIATES - CA Worker API Server is running test 2.... ");
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
app.listen(Number(port), "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api`);
    console.log(`❤️  Health Check: http://localhost:${port}/health`);
});
