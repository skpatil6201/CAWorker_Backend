import { Request, Response } from "express";
import Admin from "../models/admin.model";
import Candidate from "../models/candidate.model";
import Firm from "../models/firm.model";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await Admin.find().select('-password');
    sendSuccess(res, "Admins retrieved successfully", admins);
  } catch (error) {
    sendError(res, "Failed to retrieve admins", (error as Error).message, 500);
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const admin = await Admin.findById(id).select('-password');
    if (admin) {
      sendSuccess(res, "Admin retrieved successfully", admin);
    } else {
      sendError(res, "Admin not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to retrieve admin", (error as Error).message, 500);
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    
    if (!email && !username) {
      return sendError(res, "Email or username is required", undefined, 400);
    }

    let admin;
    if (email) {
      admin = await Admin.findOne({ email });
    } else if (username) {
      admin = await Admin.findOne({ username });
    }

    if (!admin) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", undefined, 401);
    }

    // Generate token
    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      username: admin.username,
      role: admin.role,
      userType: 'admin'
    });

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    
    sendSuccess(res, "Login successful", {
      admin: adminResponse,
      token
    });
  } catch (error) {
    sendError(res, "Login failed", (error as Error).message, 500);
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdminByEmail = await Admin.findOne({ email });
    const existingAdminByUsername = await Admin.findOne({ username });
    
    if (existingAdminByEmail) {
      return sendError(res, "Admin already exists with this email", undefined, 409);
    }
    
    if (existingAdminByUsername) {
      return sendError(res, "Admin already exists with this username", undefined, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: role || "Admin"
    });

    const savedAdmin = await newAdmin.save();
    const adminResponse = savedAdmin.toObject();
    delete adminResponse.password;
    
    sendSuccess(res, "Admin created successfully", adminResponse, 201);
  } catch (error) {
    sendError(res, "Failed to create admin", (error as Error).message, 500);
  }
};

export const updateAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (updatedAdmin) {
      sendSuccess(res, "Admin updated successfully", updatedAdmin);
    } else {
      sendError(res, "Admin not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to update admin", (error as Error).message, 500);
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deletedAdmin = await Admin.findByIdAndDelete(id);
    
    if (deletedAdmin) {
      sendSuccess(res, "Admin deleted successfully");
    } else {
      sendError(res, "Admin not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to delete admin", (error as Error).message, 500);
  }
};

// Dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [candidates, firms] = await Promise.all([
      Candidate.find(),
      Firm.find()
    ]);
    
    const stats = {
      totalCandidates: candidates.length,
      pendingCandidates: candidates.filter(c => c.status === 'Pending').length,
      approvedCandidates: candidates.filter(c => c.status === 'Approved').length,
      rejectedCandidates: candidates.filter(c => c.status === 'Rejected').length,
      totalFirms: firms.length,
      pendingFirms: firms.filter(f => f.status === 'Pending').length,
      approvedFirms: firms.filter(f => f.status === 'Approved').length,
      rejectedFirms: firms.filter(f => f.status === 'Rejected').length,
    };
    
    sendSuccess(res, "Dashboard statistics retrieved successfully", stats);
  } catch (error) {
    sendError(res, "Failed to retrieve dashboard statistics", (error as Error).message, 500);
  }
};

// Approve/Reject candidates and firms
export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return sendError(res, "Invalid status. Must be Pending, Approved, or Rejected", undefined, 400);
    }
    
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (updatedCandidate) {
      sendSuccess(res, `Candidate status updated to ${status}`, updatedCandidate);
    } else {
      sendError(res, "Candidate not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to update candidate status", (error as Error).message, 500);
  }
};

export const updateFirmStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return sendError(res, "Invalid status. Must be Pending, Approved, or Rejected", undefined, 400);
    }
    
    const updatedFirm = await Firm.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (updatedFirm) {
      sendSuccess(res, `Firm status updated to ${status}`, updatedFirm);
    } else {
      sendError(res, "Firm not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to update firm status", (error as Error).message, 500);
  }
};