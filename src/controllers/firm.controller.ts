import { Request, Response } from "express";
import Firm from "../models/firm.model";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAllFirms = async (req: Request, res: Response) => {
  try {
    const firms = await Firm.find().select('-password');
    sendSuccess(res, "Firms retrieved successfully", firms);
  } catch (error) {
    sendError(res, "Failed to retrieve firms", (error as Error).message, 500);
  }
};

export const getFirmById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    const firm = await Firm.findById(id).select('-password');
    if (firm) {
      sendSuccess(res, "Firm retrieved successfully", firm);
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

    console.log("req.body", req.body);

    // Check if firm already exists
    const existingFirm = await Firm.findOne({ email });
    if (existingFirm) {
      return sendError(res, "Firm already exists with this email", undefined, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    const newFirm = new Firm({
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

    const savedFirm = await newFirm.save();

    // Generate token
    const token = generateToken({
      id: savedFirm._id.toString(),
      email: savedFirm.email,
      userType: 'firm'
    });

    const firmResponse = savedFirm.toObject();
    delete firmResponse.password;
    
    sendSuccess(res, "Firm registered successfully", {
      firm: firmResponse,
      token
    }, 201);
  } catch (error) {
    sendError(res, "Failed to register firm", (error as Error).message, 500);
  }
};

export const loginFirm = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const firm = await Firm.findOne({ email });
    if (!firm) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    const isPasswordValid = await comparePassword(password, firm.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    // Generate token
    const token = generateToken({
      id: firm._id.toString(),
      email: firm.email,
      userType: 'firm'
    });

    const firmResponse = firm.toObject();
    delete firmResponse.password;
    
    sendSuccess(res, "Login successful", {
      firm: firmResponse,
      token
    });
  } catch (error) {
    sendError(res, "Login failed", (error as Error).message, 500);
  }
};

export const updateFirm = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedFirm = await Firm.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (updatedFirm) {
      sendSuccess(res, "Firm updated successfully", updatedFirm);
    } else {
      sendError(res, "Firm not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to update firm", (error as Error).message, 500);
  }
};

export const deleteFirm = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deletedFirm = await Firm.findByIdAndDelete(id);
    
    if (deletedFirm) {
      sendSuccess(res, "Firm deleted successfully");
    } else {
      sendError(res, "Firm not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to delete firm", (error as Error).message, 500);
  }
};

// Get firm profile (for authenticated firm)
export const getFirmProfile = async (req: AuthRequest, res: Response) => {
  try {
    const firmId = req.user.id;
    const firm = await Firm.findById(firmId).select('-password');
    
    if (firm) {
      sendSuccess(res, "Profile retrieved successfully", firm);
    } else {
      sendError(res, "Firm not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to retrieve profile", (error as Error).message, 500);
  }
};