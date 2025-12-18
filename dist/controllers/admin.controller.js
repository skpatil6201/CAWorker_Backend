"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFirmStatus = exports.updateCandidateStatus = exports.getDashboardStats = exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = exports.loginAdmin = exports.getAdminById = exports.getAllAdmins = void 0;
const admin_model_1 = __importDefault(require("../models/admin.model"));
const candidate_model_1 = __importDefault(require("../models/candidate.model"));
const firm_model_1 = __importDefault(require("../models/firm.model"));
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const getAllAdmins = (req, res) => {
    try {
        const admins = admin_model_1.default.getAll();
        // Remove passwords from response
        const adminsWithoutPasswords = admins.map((_a) => {
            var { password } = _a, admin = __rest(_a, ["password"]);
            return admin;
        });
        (0, response_1.sendSuccess)(res, "Admins retrieved successfully", adminsWithoutPasswords);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve admins", error.message, 500);
    }
};
exports.getAllAdmins = getAllAdmins;
const getAdminById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return (0, response_1.sendError)(res, "Invalid admin ID", undefined, 400);
        }
        const admin = admin_model_1.default.getById(id);
        if (admin) {
            const { password } = admin, adminWithoutPassword = __rest(admin, ["password"]);
            (0, response_1.sendSuccess)(res, "Admin retrieved successfully", adminWithoutPassword);
        }
        else {
            (0, response_1.sendError)(res, "Admin not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve admin", error.message, 500);
    }
};
exports.getAdminById = getAdminById;
const loginAdmin = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email && !username) {
            return (0, response_1.sendError)(res, "Email or username is required", undefined, 400);
        }
        let admin;
        if (email) {
            admin = admin_model_1.default.getByEmail(email);
        }
        else if (username) {
            admin = admin_model_1.default.getByUsername(username);
        }
        if (!admin) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, admin.password);
        if (!isPasswordValid) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: admin.id,
            email: admin.email,
            username: admin.username,
            role: admin.role,
            userType: 'admin'
        });
        const { password: _ } = admin, adminWithoutPassword = __rest(admin, ["password"]);
        (0, response_1.sendSuccess)(res, "Login successful", {
            admin: adminWithoutPassword,
            token
        });
    }
    catch (error) {
        (0, response_1.sendError)(res, "Login failed", error.message, 500);
    }
};
exports.loginAdmin = loginAdmin;
const createAdmin = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Check if admin already exists
        const existingAdminByEmail = admin_model_1.default.getByEmail(email);
        const existingAdminByUsername = admin_model_1.default.getByUsername(username);
        if (existingAdminByEmail) {
            return (0, response_1.sendError)(res, "Admin already exists with this email", undefined, 409);
        }
        if (existingAdminByUsername) {
            return (0, response_1.sendError)(res, "Admin already exists with this username", undefined, 409);
        }
        // Hash password
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newAdmin = admin_model_1.default.create({
            username,
            email,
            password: hashedPassword,
            role: role || "Admin"
        });
        const { password: _ } = newAdmin, adminWithoutPassword = __rest(newAdmin, ["password"]);
        (0, response_1.sendSuccess)(res, "Admin created successfully", adminWithoutPassword, 201);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to create admin", error.message, 500);
    }
};
exports.createAdmin = createAdmin;
const updateAdmin = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return (0, response_1.sendError)(res, "Invalid admin ID", undefined, 400);
        }
        // If password is being updated, hash it
        if (req.body.password) {
            req.body.password = await (0, auth_1.hashPassword)(req.body.password);
        }
        const updatedAdmin = admin_model_1.default.update(id, req.body);
        if (updatedAdmin) {
            const { password } = updatedAdmin, adminWithoutPassword = __rest(updatedAdmin, ["password"]);
            (0, response_1.sendSuccess)(res, "Admin updated successfully", adminWithoutPassword);
        }
        else {
            (0, response_1.sendError)(res, "Admin not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to update admin", error.message, 500);
    }
};
exports.updateAdmin = updateAdmin;
const deleteAdmin = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return (0, response_1.sendError)(res, "Invalid admin ID", undefined, 400);
        }
        const deleted = admin_model_1.default.delete(id);
        if (deleted) {
            (0, response_1.sendSuccess)(res, "Admin deleted successfully");
        }
        else {
            (0, response_1.sendError)(res, "Admin not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to delete admin", error.message, 500);
    }
};
exports.deleteAdmin = deleteAdmin;
// Dashboard statistics
const getDashboardStats = (req, res) => {
    try {
        const candidates = candidate_model_1.default.getAll();
        const firms = firm_model_1.default.getAll();
        const stats = {
            totalCandidates: candidates.length,
            pendingCandidates: candidates.filter(c => c.status === 'Pending').length,
            approvedCandidates: candidates.filter(c => c.status === 'Approved').length,
            rejectedCandidates: candidates.filter(c => c.status === 'Rejected').length,
            totalFirms: firms.length,
            pendingFirms: firms.filter(f => f.status === 'Pending').length,
            approvedFirms: firms.filter(f => f.status === 'Approved').length,
            rejectedFirms: firms.filter(f => f.status === 'Rejected').length,
        };
        (0, response_1.sendSuccess)(res, "Dashboard statistics retrieved successfully", stats);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve dashboard statistics", error.message, 500);
    }
};
exports.getDashboardStats = getDashboardStats;
// Approve/Reject candidates and firms
const updateCandidateStatus = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return (0, response_1.sendError)(res, "Invalid status. Must be Pending, Approved, or Rejected", undefined, 400);
        }
        const updatedCandidate = candidate_model_1.default.update(id, { status });
        if (updatedCandidate) {
            const { password } = updatedCandidate, candidateWithoutPassword = __rest(updatedCandidate, ["password"]);
            (0, response_1.sendSuccess)(res, `Candidate status updated to ${status}`, candidateWithoutPassword);
        }
        else {
            (0, response_1.sendError)(res, "Candidate not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to update candidate status", error.message, 500);
    }
};
exports.updateCandidateStatus = updateCandidateStatus;
const updateFirmStatus = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return (0, response_1.sendError)(res, "Invalid status. Must be Pending, Approved, or Rejected", undefined, 400);
        }
        const updatedFirm = firm_model_1.default.update(id, { status });
        if (updatedFirm) {
            const { password } = updatedFirm, firmWithoutPassword = __rest(updatedFirm, ["password"]);
            (0, response_1.sendSuccess)(res, `Firm status updated to ${status}`, firmWithoutPassword);
        }
        else {
            (0, response_1.sendError)(res, "Firm not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to update firm status", error.message, 500);
    }
};
exports.updateFirmStatus = updateFirmStatus;
