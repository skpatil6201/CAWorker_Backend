import { Request, Response } from "express";
import Candidate from "../models/candidate.model";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAllCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await Candidate.find().select('-password');
    sendSuccess(res, "Candidates retrieved successfully", candidates);
  } catch (error) {
    sendError(res, "Failed to retrieve candidates", (error as Error).message, 500);
  }
};

export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const candidate = await Candidate.findById(id).select('-password');
    if (candidate) {
      sendSuccess(res, "Candidate retrieved successfully", candidate);
    } else {
      sendError(res, "Candidate not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to retrieve candidate", (error as Error).message, 500);
  }
};

export const registerCandidate = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      dateOfBirth,
      gender,
      mobileNumber,
      email,
      password,
      address,
      highestQualification,
      certifications,
      yearsOfExperience,
      currentPreviousEmployer,
      positionHeld,
      areasOfExpertise,
      softwareProficiency,
      otherSoftware,
      documents
    } = req.body;

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return sendError(res, "Candidate already exists with this email", undefined, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    const newCandidate = new Candidate({
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
    const token = generateToken({
      id: savedCandidate._id.toString(),
      email: savedCandidate.email,
      userType: 'candidate'
    });

    const candidateResponse = savedCandidate.toObject();
    delete candidateResponse.password;
    
    sendSuccess(res, "Candidate registered successfully", {
      candidate: candidateResponse,
      token
    }, 201);
  } catch (error) {
    sendError(res, "Failed to register candidate", (error as Error).message, 500);
  }
};

export const loginCandidate = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    const isPasswordValid = await comparePassword(password, candidate.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    // Generate token
    const token = generateToken({
      id: candidate._id.toString(),
      email: candidate.email,
      userType: 'candidate'
    });

    const candidateResponse = candidate.toObject();
    delete candidateResponse.password;
    
    sendSuccess(res, "Login successful", {
      candidate: candidateResponse,
      token
    });
  } catch (error) {
    sendError(res, "Login failed", (error as Error).message, 500);
  }
};

export const updateCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (updatedCandidate) {
      sendSuccess(res, "Candidate updated successfully", updatedCandidate);
    } else {
      sendError(res, "Candidate not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to update candidate", (error as Error).message, 500);
  }
};

export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deletedCandidate = await Candidate.findByIdAndDelete(id);
    
    if (deletedCandidate) {
      sendSuccess(res, "Candidate deleted successfully");
    } else {
      sendError(res, "Candidate not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to delete candidate", (error as Error).message, 500);
  }
};

// Get candidate profile (for authenticated candidate)
export const getCandidateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const candidateId = req.user.id;
    const candidate = await Candidate.findById(candidateId).select('-password');
    
    if (candidate) {
      sendSuccess(res, "Profile retrieved successfully", candidate);
    } else {
      sendError(res, "Candidate not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to retrieve profile", (error as Error).message, 500);
  }
};