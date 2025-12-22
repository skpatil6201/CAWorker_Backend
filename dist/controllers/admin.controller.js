"use strict";
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
const getAllAdmins = async (req, res) => {
    try {
        const admins = await admin_model_1.default.find().select('-password');
        (0, response_1.sendSuccess)(res, "Admins retrieved successfully", admins);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve admins", error.message, 500);
    }
};
exports.getAllAdmins = getAllAdmins;
const getAdminById = async (req, res) => {
    try {
        const id = req.params.id;
        const admin = await admin_model_1.default.findById(id).select('-password');
        if (admin) {
            (0, response_1.sendSuccess)(res, "Admin retrieved successfully", admin);
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
            admin = await admin_model_1.default.findOne({ email });
        }
        else if (username) {
            admin = await admin_model_1.default.findOne({ username });
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
            id: admin._id.toString(),
            email: admin.email,
            username: admin.username,
            role: admin.role,
            userType: 'admin'
        });
        const adminResponse = admin.toObject();
        delete adminResponse.password;
        (0, response_1.sendSuccess)(res, "Login successful", {
            admin: adminResponse,
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
        const existingAdminByEmail = await admin_model_1.default.findOne({ email });
        const existingAdminByUsername = await admin_model_1.default.findOne({ username });
        if (existingAdminByEmail) {
            return (0, response_1.sendError)(res, "Admin already exists with this email", undefined, 409);
        }
        if (existingAdminByUsername) {
            return (0, response_1.sendError)(res, "Admin already exists with this username", undefined, 409);
        }
        // Hash password
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newAdmin = new admin_model_1.default({
            username,
            email,
            password: hashedPassword,
            role: role || "Admin"
        });
        const savedAdmin = await newAdmin.save();
        const adminResponse = savedAdmin.toObject();
        delete adminResponse.password;
        (0, response_1.sendSuccess)(res, "Admin created successfully", adminResponse, 201);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to create admin", error.message, 500);
    }
};
exports.createAdmin = createAdmin;
const updateAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        // If password is being updated, hash it
        if (req.body.password) {
            req.body.password = await (0, auth_1.hashPassword)(req.body.password);
        }
        const updatedAdmin = await admin_model_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-password');
        if (updatedAdmin) {
            (0, response_1.sendSuccess)(res, "Admin updated successfully", updatedAdmin);
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
const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedAdmin = await admin_model_1.default.findByIdAndDelete(id);
        if (deletedAdmin) {
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
const getDashboardStats = async (req, res) => {
    try {
        const [candidates, firms] = await Promise.all([
            candidate_model_1.default.find(),
            firm_model_1.default.find()
        ]);
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
const updateCandidateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return (0, response_1.sendError)(res, "Invalid status. Must be Pending, Approved, or Rejected", undefined, 400);
        }
        const updatedCandidate = await candidate_model_1.default.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).select('-password');
        if (updatedCandidate) {
            (0, response_1.sendSuccess)(res, `Candidate status updated to ${status}`, updatedCandidate);
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
const updateFirmStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return (0, response_1.sendError)(res, "Invalid status. Must be Pending, Approved, or Rejected", undefined, 400);
        }
        const updatedFirm = await firm_model_1.default.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).select('-password');
        if (updatedFirm) {
            (0, response_1.sendSuccess)(res, `Firm status updated to ${status}`, updatedFirm);
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
