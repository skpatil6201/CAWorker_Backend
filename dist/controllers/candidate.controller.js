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
exports.getCandidateProfile = exports.deleteCandidate = exports.updateCandidate = exports.loginCandidate = exports.registerCandidate = exports.getCandidateById = exports.getAllCandidates = void 0;
const candidate_model_1 = __importDefault(require("../models/candidate.model"));
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const getAllCandidates = (req, res) => {
    try {
        const candidates = candidate_model_1.default.getAll();
        // Remove passwords from response
        const candidatesWithoutPasswords = candidates.map((_a) => {
            var { password } = _a, candidate = __rest(_a, ["password"]);
            return candidate;
        });
        (0, response_1.sendSuccess)(res, "Candidates retrieved successfully", candidatesWithoutPasswords);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve candidates", error.message, 500);
    }
};
exports.getAllCandidates = getAllCandidates;
const getCandidateById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return (0, response_1.sendError)(res, "Invalid candidate ID", undefined, 400);
        }
        const candidate = candidate_model_1.default.getById(id);
        if (candidate) {
            const { password } = candidate, candidateWithoutPassword = __rest(candidate, ["password"]);
            (0, response_1.sendSuccess)(res, "Candidate retrieved successfully", candidateWithoutPassword);
        }
        else {
            (0, response_1.sendError)(res, "Candidate not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve candidate", error.message, 500);
    }
};
exports.getCandidateById = getCandidateById;
const registerCandidate = async (req, res) => {
    try {
        const { fullName, dateOfBirth, gender, mobileNumber, email, password, address, highestQualification, certifications, yearsOfExperience, currentPreviousEmployer, positionHeld, areasOfExpertise, softwareProficiency, otherSoftware, documents } = req.body;
        // Check if candidate already exists
        const existingCandidate = candidate_model_1.default.getByEmail(email);
        if (existingCandidate) {
            return (0, response_1.sendError)(res, "Candidate already exists with this email", undefined, 409);
        }
        // Hash password
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newCandidate = candidate_model_1.default.create({
            fullName,
            dateOfBirth,
            gender,
            mobileNumber,
            email,
            password: hashedPassword,
            address,
            highestQualification,
            certifications,
            yearsOfExperience,
            currentPreviousEmployer,
            positionHeld,
            areasOfExpertise: areasOfExpertise || [],
            softwareProficiency: softwareProficiency || [],
            otherSoftware,
            documents: documents || []
        });
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: newCandidate.id,
            email: newCandidate.email,
            userType: 'candidate'
        });
        const { password: _ } = newCandidate, candidateWithoutPassword = __rest(newCandidate, ["password"]);
        (0, response_1.sendSuccess)(res, "Candidate registered successfully", {
            candidate: candidateWithoutPassword,
            token
        }, 201);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to register candidate", error.message, 500);
    }
};
exports.registerCandidate = registerCandidate;
const loginCandidate = async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = candidate_model_1.default.getByEmail(email);
        if (!candidate) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, candidate.password);
        if (!isPasswordValid) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: candidate.id,
            email: candidate.email,
            userType: 'candidate'
        });
        const { password: _ } = candidate, candidateWithoutPassword = __rest(candidate, ["password"]);
        (0, response_1.sendSuccess)(res, "Login successful", {
            candidate: candidateWithoutPassword,
            token
        });
    }
    catch (error) {
        (0, response_1.sendError)(res, "Login failed", error.message, 500);
    }
};
exports.loginCandidate = loginCandidate;
const updateCandidate = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return (0, response_1.sendError)(res, "Invalid candidate ID", undefined, 400);
        }
        // If password is being updated, hash it
        if (req.body.password) {
            req.body.password = await (0, auth_1.hashPassword)(req.body.password);
        }
        const updatedCandidate = candidate_model_1.default.update(id, req.body);
        if (updatedCandidate) {
            const { password } = updatedCandidate, candidateWithoutPassword = __rest(updatedCandidate, ["password"]);
            (0, response_1.sendSuccess)(res, "Candidate updated successfully", candidateWithoutPassword);
        }
        else {
            (0, response_1.sendError)(res, "Candidate not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to update candidate", error.message, 500);
    }
};
exports.updateCandidate = updateCandidate;
const deleteCandidate = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return (0, response_1.sendError)(res, "Invalid candidate ID", undefined, 400);
        }
        const deleted = candidate_model_1.default.delete(id);
        if (deleted) {
            (0, response_1.sendSuccess)(res, "Candidate deleted successfully");
        }
        else {
            (0, response_1.sendError)(res, "Candidate not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to delete candidate", error.message, 500);
    }
};
exports.deleteCandidate = deleteCandidate;
// Get candidate profile (for authenticated candidate)
const getCandidateProfile = (req, res) => {
    try {
        const candidateId = req.user.id;
        const candidate = candidate_model_1.default.getById(candidateId);
        if (candidate) {
            const { password } = candidate, candidateWithoutPassword = __rest(candidate, ["password"]);
            (0, response_1.sendSuccess)(res, "Profile retrieved successfully", candidateWithoutPassword);
        }
        else {
            (0, response_1.sendError)(res, "Candidate not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve profile", error.message, 500);
    }
};
exports.getCandidateProfile = getCandidateProfile;
