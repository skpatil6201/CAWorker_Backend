import { Request, Response } from "express";
import Job from "../models/job.model";
import Firm from "../models/firm.model";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

// Get all active jobs (public)
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ status: "active" }).sort({ createdAt: -1 });
    sendSuccess(res, "Jobs retrieved successfully", jobs);
  } catch (error) {
    sendError(res, "Failed to retrieve jobs", (error as Error).message, 500);
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id);
    
    if (job) {
      sendSuccess(res, "Job retrieved successfully", job);
    } else {
      sendError(res, "Job not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to retrieve job", (error as Error).message, 500);
  }
};

// Get jobs for current firm
export const getFirmJobs = async (req: AuthRequest, res: Response) => {
  try {
    const firmId = req.user.id;
    const jobs = await Job.find({ firmId }).sort({ createdAt: -1 });
    sendSuccess(res, "Firm jobs retrieved successfully", jobs);
  } catch (error) {
    sendError(res, "Failed to retrieve firm jobs", (error as Error).message, 500);
  }
};

// Create new job posting
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const firmId = req.user.id;
    const { title, description, requirements, salary, location, jobType } = req.body;

    // Get firm details
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return sendError(res, "Firm not found", undefined, 404);
    }

    const newJob = new Job({
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
    sendSuccess(res, "Job posted successfully", savedJob, 201);
  } catch (error) {
    sendError(res, "Failed to create job", (error as Error).message, 500);
  }
};

// Update job
export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.id;
    const firmId = req.user.id;

    // Check if job belongs to this firm
    const job = await Job.findOne({ _id: jobId, firmId });
    if (!job) {
      return sendError(res, "Job not found or unauthorized", undefined, 404);
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      req.body,
      { new: true, runValidators: true }
    );

    sendSuccess(res, "Job updated successfully", updatedJob);
  } catch (error) {
    sendError(res, "Failed to update job", (error as Error).message, 500);
  }
};

// Delete job
export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.id;
    const firmId = req.user.id;

    // Check if job belongs to this firm
    const job = await Job.findOne({ _id: jobId, firmId });
    if (!job) {
      return sendError(res, "Job not found or unauthorized", undefined, 404);
    }

    await Job.findByIdAndDelete(jobId);
    sendSuccess(res, "Job deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete job", (error as Error).message, 500);
  }
};

// Close job posting
export const closeJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.id;
    const firmId = req.user.id;

    // Check if job belongs to this firm
    const job = await Job.findOne({ _id: jobId, firmId });
    if (!job) {
      return sendError(res, "Job not found or unauthorized", undefined, 404);
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { status: "closed" },
      { new: true }
    );

    sendSuccess(res, "Job closed successfully", updatedJob);
  } catch (error) {
    sendError(res, "Failed to close job", (error as Error).message, 500);
  }
};