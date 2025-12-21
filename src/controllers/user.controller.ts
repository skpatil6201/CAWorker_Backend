import { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword } from "../utils/auth";
import { sendSuccess, sendError } from "../utils/response";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    sendSuccess(res, "Users retrieved successfully", users);
  } catch (error) {
    sendError(res, "Failed to retrieve users", (error as Error).message, 500);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id).select('-password');
    if (user) {
      sendSuccess(res, "User retrieved successfully", user);
    } else {
      sendError(res, "User not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to retrieve user", (error as Error).message, 500);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, address, phone, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, "User already exists with this email", undefined, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    const newUser = new User({
      name,
      address,
      phone,
      email,
      password: hashedPassword,
      userType
    });

    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    sendSuccess(res, "User created successfully", userResponse, 201);
  } catch (error) {
    sendError(res, "Failed to create user", (error as Error).message, 500);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (updatedUser) {
      sendSuccess(res, "User updated successfully", updatedUser);
    } else {
      sendError(res, "User not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to update user", (error as Error).message, 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deletedUser = await User.findByIdAndDelete(id);
    
    if (deletedUser) {
      sendSuccess(res, "User deleted successfully");
    } else {
      sendError(res, "User not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to delete user", (error as Error).message, 500);
  }
};
