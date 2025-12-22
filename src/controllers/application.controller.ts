import { Request, Response } from "express";
import Application from "../models/application.model";
import Job from "../models/job.model";
import Candidate from "../models/candidate.model";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

// Apply for a job
export const applyForJob = async (req: AuthRequest, res: Response) => {
  try {
    const candidateId = req.user.id;
    const jobId = req.params.jobId;
    const { coverLetter } = req.body;

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, "Job not found", undefined, 404);
    }

    // Get candidate details
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return sendError(res, "Candidate not found", undefined, 404);
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, candidateId });
    if (existingApplication) {
      return sendError(res, "You have already applied for this job", undefined, 409);
    }

    const newApplication = new Application({
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
    await Job.findByIdAndUpdate(jobId, { 
      $inc: { applicationsCount: 1 } 
    });

    sendSuccess(res, "Application submitted successfully", savedApplication, 201);
  } catch (error) {
    sendError(res, "Failed to submit application", (error as Error).message, 500);
  }
};

// Get applications for current candidate
export const getCandidateApplications = async (req: AuthRequest, res: Response) => {
  try {
    const candidateId = req.user.id;
    const applications = await Application.find({ candidateId }).sort({ createdAt: -1 });
    sendSuccess(res, "Applications retrieved successfully", applications);
  } catch (error) {
    sendError(res, "Failed to retrieve applications", (error as Error).message, 500);
  }
};

// Get applications for current firm
export const getFirmApplications = async (req: AuthRequest, res: Response) => {
  try {
    const firmId = req.user.id;
    const applications = await Application.find({ firmId }).sort({ createdAt: -1 });
    sendSuccess(res, "Firm applications retrieved successfully", applications);
  } catch (error) {
    sendError(res, "Failed to retrieve firm applications", (error as Error).message, 500);
  }
};

// Get applications for a specific job
export const getJobApplications = async (req: AuthRequest, res: Response) => {
  try {
    const firmId = req.user.id;
    const jobId = req.params.jobId;

    // Verify job belongs to this firm
    const job = await Job.findOne({ _id: jobId, firmId });
    if (!job) {
      return sendError(res, "Job not found or unauthorized", undefined, 404);
    }

    const applications = await Application.find({ jobId }).sort({ createdAt: -1 });
    sendSuccess(res, "Job applications retrieved successfully", applications);
  } catch (error) {
    sendError(res, "Failed to retrieve job applications", (error as Error).message, 500);
  }
};

// Update application status
export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const firmId = req.user.id;
    const applicationId = req.params.id;
    const { status } = req.body;

    // Verify application belongs to this firm
    const application = await Application.findOne({ _id: applicationId, firmId });
    if (!application) {
      return sendError(res, "Application not found or unauthorized", undefined, 404);
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true, runValidators: true }
    );

    sendSuccess(res, "Application status updated successfully", updatedApplication);
  } catch (error) {
    sendError(res, "Failed to update application status", (error as Error).message, 500);
  }
};