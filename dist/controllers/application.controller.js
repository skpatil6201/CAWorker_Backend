"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getJobApplications = exports.getFirmApplications = exports.getCandidateApplications = exports.applyForJob = void 0;
const application_model_1 = __importDefault(require("../models/application.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
const candidate_model_1 = __importDefault(require("../models/candidate.model"));
const response_1 = require("../utils/response");
// Apply for a job
const applyForJob = async (req, res) => {
    try {
        const candidateId = req.user.id;
        const jobId = req.params.jobId;
        const { coverLetter } = req.body;
        // Get job details
        const job = await job_model_1.default.findById(jobId);
        if (!job) {
            return (0, response_1.sendError)(res, "Job not found", undefined, 404);
        }
        // Get candidate details
        const candidate = await candidate_model_1.default.findById(candidateId);
        if (!candidate) {
            return (0, response_1.sendError)(res, "Candidate not found", undefined, 404);
        }
        // Check if already applied
        const existingApplication = await application_model_1.default.findOne({ jobId, candidateId });
        if (existingApplication) {
            return (0, response_1.sendError)(res, "You have already applied for this job", undefined, 409);
        }
        const newApplication = new application_model_1.default({
            jobId,
            jobTitle: job.title,
            candidateId,
            candidateName: candidate.fullName,
            candidateEmail: candidate.email,
            firmId: job.firmId,
            firmName: job.firmName,
            coverLetter,
            status: "pending"
        });
        const savedApplication = await newApplication.save();
        // Update job applications count
        await job_model_1.default.findByIdAndUpdate(jobId, {
            $inc: { applicationsCount: 1 }
        });
        (0, response_1.sendSuccess)(res, "Application submitted successfully", savedApplication, 201);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to submit application", error.message, 500);
    }
};
exports.applyForJob = applyForJob;
// Get applications for current candidate
const getCandidateApplications = async (req, res) => {
    try {
        const candidateId = req.user.id;
        const applications = await application_model_1.default.find({ candidateId }).sort({ createdAt: -1 });
        (0, response_1.sendSuccess)(res, "Applications retrieved successfully", applications);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve applications", error.message, 500);
    }
};
exports.getCandidateApplications = getCandidateApplications;
// Get applications for current firm
const getFirmApplications = async (req, res) => {
    try {
        const firmId = req.user.id;
        const applications = await application_model_1.default.find({ firmId }).sort({ createdAt: -1 });
        (0, response_1.sendSuccess)(res, "Firm applications retrieved successfully", applications);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve firm applications", error.message, 500);
    }
};
exports.getFirmApplications = getFirmApplications;
// Get applications for a specific job
const getJobApplications = async (req, res) => {
    try {
        const firmId = req.user.id;
        const jobId = req.params.jobId;
        // Verify job belongs to this firm
        const job = await job_model_1.default.findOne({ _id: jobId, firmId });
        if (!job) {
            return (0, response_1.sendError)(res, "Job not found or unauthorized", undefined, 404);
        }
        const applications = await application_model_1.default.find({ jobId }).sort({ createdAt: -1 });
        (0, response_1.sendSuccess)(res, "Job applications retrieved successfully", applications);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve job applications", error.message, 500);
    }
};
exports.getJobApplications = getJobApplications;
// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const firmId = req.user.id;
        const applicationId = req.params.id;
        const { status } = req.body;
        // Verify application belongs to this firm
        const application = await application_model_1.default.findOne({ _id: applicationId, firmId });
        if (!application) {
            return (0, response_1.sendError)(res, "Application not found or unauthorized", undefined, 404);
        }
        const updatedApplication = await application_model_1.default.findByIdAndUpdate(applicationId, { status }, { new: true, runValidators: true });
        (0, response_1.sendSuccess)(res, "Application status updated successfully", updatedApplication);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to update application status", error.message, 500);
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
