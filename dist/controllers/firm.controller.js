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
exports.getFirmProfile = exports.deleteFirm = exports.updateFirm = exports.loginFirm = exports.registerFirm = exports.getFirmById = exports.getAllFirms = void 0;
const firm_model_1 = __importDefault(require("../models/firm.model"));
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const getAllFirms = (req, res) => {
    try {
        const firms = firm_model_1.default.getAll();
        // Remove passwords from response
        const firmsWithoutPasswords = firms.map((_a) => {
            var { password } = _a, firm = __rest(_a, ["password"]);
            return firm;
        });
        (0, response_1.sendSuccess)(res, "Firms retrieved successfully", firmsWithoutPasswords);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve firms", error.message, 500);
    }
};
exports.getAllFirms = getAllFirms;
const getFirmById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return (0, response_1.sendError)(res, "Invalid firm ID", undefined, 400);
        }
        const firm = firm_model_1.default.getById(id);
        if (firm) {
            const { password } = firm, firmWithoutPassword = __rest(firm, ["password"]);
            (0, response_1.sendSuccess)(res, "Firm retrieved successfully", firmWithoutPassword);
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
        // Check if firm already exists
        const existingFirm = firm_model_1.default.getByEmail(email);
        if (existingFirm) {
            return (0, response_1.sendError)(res, "Firm already exists with this email", undefined, 409);
        }
        // Hash password
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newFirm = firm_model_1.default.create({
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
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: newFirm.id,
            email: newFirm.email,
            userType: 'firm'
        });
        const { password: _ } = newFirm, firmWithoutPassword = __rest(newFirm, ["password"]);
        (0, response_1.sendSuccess)(res, "Firm registered successfully", {
            firm: firmWithoutPassword,
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
        const firm = firm_model_1.default.getByEmail(email);
        if (!firm) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, firm.password);
        if (!isPasswordValid) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: firm.id,
            email: firm.email,
            userType: 'firm'
        });
        const { password: _ } = firm, firmWithoutPassword = __rest(firm, ["password"]);
        (0, response_1.sendSuccess)(res, "Login successful", {
            firm: firmWithoutPassword,
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
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return (0, response_1.sendError)(res, "Invalid firm ID", undefined, 400);
        }
        // If password is being updated, hash it
        if (req.body.password) {
            req.body.password = await (0, auth_1.hashPassword)(req.body.password);
        }
        const updatedFirm = firm_model_1.default.update(id, req.body);
        if (updatedFirm) {
            const { password } = updatedFirm, firmWithoutPassword = __rest(updatedFirm, ["password"]);
            (0, response_1.sendSuccess)(res, "Firm updated successfully", firmWithoutPassword);
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
const deleteFirm = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return (0, response_1.sendError)(res, "Invalid firm ID", undefined, 400);
        }
        const deleted = firm_model_1.default.delete(id);
        if (deleted) {
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
const getFirmProfile = (req, res) => {
    try {
        const firmId = req.user.id;
        const firm = firm_model_1.default.getById(firmId);
        if (firm) {
            const { password } = firm, firmWithoutPassword = __rest(firm, ["password"]);
            (0, response_1.sendSuccess)(res, "Profile retrieved successfully", firmWithoutPassword);
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
