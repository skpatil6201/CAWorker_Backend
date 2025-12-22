"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeJob = exports.deleteJob = exports.updateJob = exports.createJob = exports.getFirmJobs = exports.getJobById = exports.getAllJobs = void 0;
const job_model_1 = __importDefault(require("../models/job.model"));
const firm_model_1 = __importDefault(require("../models/firm.model"));
const response_1 = require("../utils/response");
// Get all active jobs (public)
const getAllJobs = async (req, res) => {
    try {
        const jobs = await job_model_1.default.find({ status: "active" }).sort({ createdAt: -1 });
        (0, response_1.sendSuccess)(res, "Jobs retrieved successfully", jobs);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve jobs", error.message, 500);
    }
};
exports.getAllJobs = getAllJobs;
// Get job by ID
const getJobById = async (req, res) => {
    try {
        const id = req.params.id;
        const job = await job_model_1.default.findById(id);
        if (job) {
            (0, response_1.sendSuccess)(res, "Job retrieved successfully", job);
        }
        else {
            (0, response_1.sendError)(res, "Job not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve job", error.message, 500);
    }
};
exports.getJobById = getJobById;
// Get jobs for current firm
const getFirmJobs = async (req, res) => {
    try {
        const firmId = req.user.id;
        const jobs = await job_model_1.default.find({ firmId }).sort({ createdAt: -1 });
        (0, response_1.sendSuccess)(res, "Firm jobs retrieved successfully", jobs);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve firm jobs", error.message, 500);
    }
};
exports.getFirmJobs = getFirmJobs;
// Create new job posting
const createJob = async (req, res) => {
    try {
        const firmId = req.user.id;
        const { title, description, requirements, salary, location, jobType } = req.body;
        // Get firm details
        const firm = await firm_model_1.default.findById(firmId);
        if (!firm) {
            return (0, response_1.sendError)(res, "Firm not found", undefined, 404);
        }
        const newJob = new job_model_1.default({
            title,
            description,
            requirements: requirements || [],
            salary,
            location,
            jobType: jobType || "Full-time",
            firmId,
            firmName: firm.firmName,
            status: "active",
            applicationsCount: 0
        });
        const savedJob = await newJob.save();
        (0, response_1.sendSuccess)(res, "Job posted successfully", savedJob, 201);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to create job", error.message, 500);
    }
};
exports.createJob = createJob;
// Update job
const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const firmId = req.user.id;
        // Check if job belongs to this firm
        const job = await job_model_1.default.findOne({ _id: jobId, firmId });
        if (!job) {
            return (0, response_1.sendError)(res, "Job not found or unauthorized", undefined, 404);
        }
        const updatedJob = await job_model_1.default.findByIdAndUpdate(jobId, req.body, { new: true, runValidators: true });
        (0, response_1.sendSuccess)(res, "Job updated successfully", updatedJob);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to update job", error.message, 500);
    }
};
exports.updateJob = updateJob;
// Delete job
const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const firmId = req.user.id;
        // Check if job belongs to this firm
        const job = await job_model_1.default.findOne({ _id: jobId, firmId });
        if (!job) {
            return (0, response_1.sendError)(res, "Job not found or unauthorized", undefined, 404);
        }
        await job_model_1.default.findByIdAndDelete(jobId);
        (0, response_1.sendSuccess)(res, "Job deleted successfully");
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to delete job", error.message, 500);
    }
};
exports.deleteJob = deleteJob;
// Close job posting
const closeJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const firmId = req.user.id;
        // Check if job belongs to this firm
        const job = await job_model_1.default.findOne({ _id: jobId, firmId });
        if (!job) {
            return (0, response_1.sendError)(res, "Job not found or unauthorized", undefined, 404);
        }
        const updatedJob = await job_model_1.default.findByIdAndUpdate(jobId, { status: "closed" }, { new: true });
        (0, response_1.sendSuccess)(res, "Job closed successfully", updatedJob);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to close job", error.message, 500);
    }
};
exports.closeJob = closeJob;
