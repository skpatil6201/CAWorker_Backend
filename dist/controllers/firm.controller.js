"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirmProfile = exports.deleteFirm = exports.updateFirm = exports.loginFirm = exports.registerFirm = exports.getFirmById = exports.getAllFirms = void 0;
const firm_model_1 = __importDefault(require("../models/firm.model"));
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const getAllFirms = async (req, res) => {
    try {
        const firms = await firm_model_1.default.find().select('-password');
        (0, response_1.sendSuccess)(res, "Firms retrieved successfully", firms);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve firms", error.message, 500);
    }
};
exports.getAllFirms = getAllFirms;
const getFirmById = async (req, res) => {
    try {
        const id = req.params.id;
        const firm = await firm_model_1.default.findById(id).select('-password');
        if (firm) {
            (0, response_1.sendSuccess)(res, "Firm retrieved successfully", firm);
        }
        else {
            (0, response_1.sendError)(res, "Firm not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve firm", error.message, 500);
    }
};
exports.getFirmById = getFirmById;
const registerFirm = async (req, res) => {
    try {
        const { firmName, registrationNumber, dateOfRegistration, panGstNumber, firmType, firmTypeOther, headOfficeAddress, cityStatePin, firmContactNumber, email, password, website, partners, areasOfPractice, otherPracticeArea, documents } = req.body;
        console.log("req.body", req.body);
        // Check if firm already exists
        const existingFirm = await firm_model_1.default.findOne({ email });
        if (existingFirm) {
            return (0, response_1.sendError)(res, "Firm already exists with this email", undefined, 409);
        }
        // Hash password
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newFirm = new firm_model_1.default({
            firmName,
            registrationNumber,
            dateOfRegistration,
            panGstNumber,
            firmType,
            firmTypeOther,
            headOfficeAddress,
            cityStatePin,
            firmContactNumber,
            email,
            password: hashedPassword,
            website,
            partners: partners || [],
            areasOfPractice: areasOfPractice || [],
            otherPracticeArea,
            documents: documents || []
        });
        const savedFirm = await newFirm.save();
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: savedFirm._id.toString(),
            email: savedFirm.email,
            userType: 'firm'
        });
        const firmResponse = savedFirm.toObject();
        delete firmResponse.password;
        (0, response_1.sendSuccess)(res, "Firm registered successfully", {
            firm: firmResponse,
            token
        }, 201);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to register firm", error.message, 500);
    }
};
exports.registerFirm = registerFirm;
const loginFirm = async (req, res) => {
    try {
        const { email, password } = req.body;
        const firm = await firm_model_1.default.findOne({ email });
        if (!firm) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, firm.password);
        if (!isPasswordValid) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: firm._id.toString(),
            email: firm.email,
            userType: 'firm'
        });
        const firmResponse = firm.toObject();
        delete firmResponse.password;
        (0, response_1.sendSuccess)(res, "Login successful", {
            firm: firmResponse,
            token
        });
    }
    catch (error) {
        (0, response_1.sendError)(res, "Login failed", error.message, 500);
    }
};
exports.loginFirm = loginFirm;
const updateFirm = async (req, res) => {
    try {
        const id = req.params.id;
        // If password is being updated, hash it
        if (req.body.password) {
            req.body.password = await (0, auth_1.hashPassword)(req.body.password);
        }
        const updatedFirm = await firm_model_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-password');
        if (updatedFirm) {
            (0, response_1.sendSuccess)(res, "Firm updated successfully", updatedFirm);
        }
        else {
            (0, response_1.sendError)(res, "Firm not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to update firm", error.message, 500);
    }
};
exports.updateFirm = updateFirm;
const deleteFirm = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedFirm = await firm_model_1.default.findByIdAndDelete(id);
        if (deletedFirm) {
            (0, response_1.sendSuccess)(res, "Firm deleted successfully");
        }
        else {
            (0, response_1.sendError)(res, "Firm not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to delete firm", error.message, 500);
    }
};
exports.deleteFirm = deleteFirm;
// Get firm profile (for authenticated firm)
const getFirmProfile = async (req, res) => {
    try {
        const firmId = req.user.id;
        const firm = await firm_model_1.default.findById(firmId).select('-password');
        if (firm) {
            (0, response_1.sendSuccess)(res, "Profile retrieved successfully", firm);
        }
        else {
            (0, response_1.sendError)(res, "Firm not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve profile", error.message, 500);
    }
};
exports.getFirmProfile = getFirmProfile;
