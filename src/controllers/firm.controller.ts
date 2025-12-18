import { Request, Response } from "express";
import FirmModel from "../models/firm.model";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAllFirms = (req: Request, res: Response) => {
  try {
    const firms = FirmModel.getAll();
    // Remove passwords from response
    const firmsWithoutPasswords = firms.map(({ password, ...firm }) => firm);
    sendSuccess(res, "Firms retrieved successfully", firmsWithoutPasswords);
  } catch (error) {
    sendError(res, "Failed to retrieve firms", (error as Error).message, 500);
  }
};

export const getFirmById = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, "Invalid firm ID", undefined, 400);
    }

    const firm = FirmModel.getById(id);
    if (firm) {
      const { password, ...firmWithoutPassword } = firm;
      sendSuccess(res, "Firm retrieved successfully", firmWithoutPassword);
    } else {
      sendError(res, "Firm not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to retrieve firm", (error as Error).message, 500);
  }
};

export const registerFirm = async (req: Request, res: Response) => {
  try {
    const {
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
      password,
      website,
      partners,
      areasOfPractice,
      otherPracticeArea,
      documents
    } = req.body;

    // Check if firm already exists
    const existingFirm = FirmModel.getByEmail(email);
    if (existingFirm) {
      return sendError(res, "Firm already exists with this email", undefined, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    const newFirm = FirmModel.create({
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
    const token = generateToken({
      id: newFirm.id,
      email: newFirm.email,
      userType: 'firm'
    });

    const { password: _, ...firmWithoutPassword } = newFirm;
    
    sendSuccess(res, "Firm registered successfully", {
      firm: firmWithoutPassword,
      token
    }, 201);
  } catch (error) {
    sendError(res, "Failed to register firm", (error as Error).message, 500);
  }
};

export const loginFirm = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const firm = FirmModel.getByEmail(email);
    if (!firm) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    const isPasswordValid = await comparePassword(password, firm.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    // Generate token
    const token = generateToken({
      id: firm.id,
      email: firm.email,
      userType: 'firm'
    });

    const { password: _, ...firmWithoutPassword } = firm;
    
    sendSuccess(res, "Login successful", {
      firm: firmWithoutPassword,
      token
    });
  } catch (error) {
    sendError(res, "Login failed", (error as Error).message, 500);
  }
};

export const updateFirm = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, "Invalid firm ID", undefined, 400);
    }

    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedFirm = FirmModel.update(id, req.body);
    
    if (updatedFirm) {
      const { password, ...firmWithoutPassword } = updatedFirm;
      sendSuccess(res, "Firm updated successfully", firmWithoutPassword);
    } else {
      sendError(res, "Firm not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to update firm", (error as Error).message, 500);
  }
};

export const deleteFirm = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, "Invalid firm ID", undefined, 400);
    }

    const deleted = FirmModel.delete(id);
    
    if (deleted) {
      sendSuccess(res, "Firm deleted successfully");
    } else {
      sendError(res, "Firm not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to delete firm", (error as Error).message, 500);
  }
};

// Get firm profile (for authenticated firm)
export const getFirmProfile = (req: AuthRequest, res: Response) => {
  try {
    const firmId = req.user.id;
    const firm = FirmModel.getById(firmId);
    
    if (firm) {
      const { password, ...firmWithoutPassword } = firm;
      sendSuccess(res, "Profile retrieved successfully", firmWithoutPassword);
    } else {
      sendError(res, "Firm not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to retrieve profile", (error as Error).message, 500);
  }
};