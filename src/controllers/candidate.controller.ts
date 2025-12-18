import { Request, Response } from "express";
import CandidateModel from "../models/candidate.model";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAllCandidates = (req: Request, res: Response) => {
  try {
    const candidates = CandidateModel.getAll();
    // Remove passwords from response
    const candidatesWithoutPasswords = candidates.map(({ password, ...candidate }) => candidate);
    sendSuccess(res, "Candidates retrieved successfully", candidatesWithoutPasswords);
  } catch (error) {
    sendError(res, "Failed to retrieve candidates", (error as Error).message, 500);
  }
};

export const getCandidateById = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, "Invalid candidate ID", undefined, 400);
    }

    const candidate = CandidateModel.getById(id);
    if (candidate) {
      const { password, ...candidateWithoutPassword } = candidate;
      sendSuccess(res, "Candidate retrieved successfully", candidateWithoutPassword);
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
    const existingCandidate = CandidateModel.getByEmail(email);
    if (existingCandidate) {
      return sendError(res, "Candidate already exists with this email", undefined, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    const newCandidate = CandidateModel.create({
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
    const token = generateToken({
      id: newCandidate.id,
      email: newCandidate.email,
      userType: 'candidate'
    });

    const { password: _, ...candidateWithoutPassword } = newCandidate;
    
    sendSuccess(res, "Candidate registered successfully", {
      candidate: candidateWithoutPassword,
      token
    }, 201);
  } catch (error) {
    sendError(res, "Failed to register candidate", (error as Error).message, 500);
  }
};

export const loginCandidate = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const candidate = CandidateModel.getByEmail(email);
    if (!candidate) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    const isPasswordValid = await comparePassword(password, candidate.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    // Generate token
    const token = generateToken({
      id: candidate.id,
      email: candidate.email,
      userType: 'candidate'
    });

    const { password: _, ...candidateWithoutPassword } = candidate;
    
    sendSuccess(res, "Login successful", {
      candidate: candidateWithoutPassword,
      token
    });
  } catch (error) {
    sendError(res, "Login failed", (error as Error).message, 500);
  }
};

export const updateCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, "Invalid candidate ID", undefined, 400);
    }

    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedCandidate = CandidateModel.update(id, req.body);
    
    if (updatedCandidate) {
      const { password, ...candidateWithoutPassword } = updatedCandidate;
      sendSuccess(res, "Candidate updated successfully", candidateWithoutPassword);
    } else {
      sendError(res, "Candidate not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to update candidate", (error as Error).message, 500);
  }
};

export const deleteCandidate = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, "Invalid candidate ID", undefined, 400);
    }

    const deleted = CandidateModel.delete(id);
    
    if (deleted) {
      sendSuccess(res, "Candidate deleted successfully");
    } else {
      sendError(res, "Candidate not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to delete candidate", (error as Error).message, 500);
  }
};

// Get candidate profile (for authenticated candidate)
export const getCandidateProfile = (req: AuthRequest, res: Response) => {
  try {
    const candidateId = req.user.id;
    const candidate = CandidateModel.getById(candidateId);
    
    if (candidate) {
      const { password, ...candidateWithoutPassword } = candidate;
      sendSuccess(res, "Profile retrieved successfully", candidateWithoutPassword);
    } else {
      sendError(res, "Candidate not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to retrieve profile", (error as Error).message, 500);
  }
};