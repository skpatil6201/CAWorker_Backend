"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidateProfile = exports.deleteCandidate = exports.updateCandidate = exports.loginCandidate = exports.registerCandidate = exports.getCandidateById = exports.getAllCandidates = void 0;
const candidate_model_1 = __importDefault(require("../models/candidate.model"));
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await candidate_model_1.default.find().select('-password');
        (0, response_1.sendSuccess)(res, "Candidates retrieved successfully", candidates);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve candidates", error.message, 500);
    }
};
exports.getAllCandidates = getAllCandidates;
const getCandidateById = async (req, res) => {
    try {
        const id = req.params.id;
        const candidate = await candidate_model_1.default.findById(id).select('-password');
        if (candidate) {
            (0, response_1.sendSuccess)(res, "Candidate retrieved successfully", candidate);
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
        const existingCandidate = await candidate_model_1.default.findOne({ email });
        if (existingCandidate) {
            return (0, response_1.sendError)(res, "Candidate already exists with this email", undefined, 409);
        }
        // Hash password
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newCandidate = new candidate_model_1.default({
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
        const savedCandidate = await newCandidate.save();
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: savedCandidate._id.toString(),
            email: savedCandidate.email,
            userType: 'candidate'
        });
        const candidateResponse = savedCandidate.toObject();
        delete candidateResponse.password;
        (0, response_1.sendSuccess)(res, "Candidate registered successfully", {
            candidate: candidateResponse,
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
        const candidate = await candidate_model_1.default.findOne({ email });
        if (!candidate) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, candidate.password);
        if (!isPasswordValid) {
            return (0, response_1.sendError)(res, "Invalid credentials", undefined, 401);
        }
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: candidate._id.toString(),
            email: candidate.email,
            userType: 'candidate'
        });
        const candidateResponse = candidate.toObject();
        delete candidateResponse.password;
        (0, response_1.sendSuccess)(res, "Login successful", {
            candidate: candidateResponse,
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
        const id = req.params.id;
        // If password is being updated, hash it
        if (req.body.password) {
            req.body.password = await (0, auth_1.hashPassword)(req.body.password);
        }
        const updatedCandidate = await candidate_model_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-password');
        if (updatedCandidate) {
            (0, response_1.sendSuccess)(res, "Candidate updated successfully", updatedCandidate);
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
const deleteCandidate = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedCandidate = await candidate_model_1.default.findByIdAndDelete(id);
        if (deletedCandidate) {
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
const getCandidateProfile = async (req, res) => {
    try {
        const candidateId = req.user.id;
        const candidate = await candidate_model_1.default.findById(candidateId).select('-password');
        if (candidate) {
            (0, response_1.sendSuccess)(res, "Profile retrieved successfully", candidate);
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
