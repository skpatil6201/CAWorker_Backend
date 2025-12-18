import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { hashPassword } from "../utils/auth";
import { sendSuccess, sendError } from "../utils/response";

export const getAllUsers = (req: Request, res: Response) => {
  try {
    const users = UserModel.getAll();
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    sendSuccess(res, "Users retrieved successfully", usersWithoutPasswords);
  } catch (error) {
    sendError(res, "Failed to retrieve users", (error as Error).message, 500);
  }
};

export const getUserById = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, "Invalid user ID", undefined, 400);
    }

    const user = UserModel.getById(id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      sendSuccess(res, "User retrieved successfully", userWithoutPassword);
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
    const existingUser = UserModel.getAll().find(u => u.email === email);
    if (existingUser) {
      return sendError(res, "User already exists with this email", undefined, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    const newUser = UserModel.create({
      name,
      address,
      phone,
      email,
      password: hashedPassword,
      userType
    });

    const { password: _, ...userWithoutPassword } = newUser;
    sendSuccess(res, "User created successfully", userWithoutPassword, 201);
  } catch (error) {
    sendError(res, "Failed to create user", (error as Error).message, 500);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, "Invalid user ID", undefined, 400);
    }

    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedUser = UserModel.update(id, req.body);
    
    if (updatedUser) {
      const { password, ...userWithoutPassword } = updatedUser;
      sendSuccess(res, "User updated successfully", userWithoutPassword);
    } else {
      sendError(res, "User not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to update user", (error as Error).message, 500);
  }
};

export const deleteUser = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, "Invalid user ID", undefined, 400);
    }

    const deleted = UserModel.delete(id);
    
    if (deleted) {
      sendSuccess(res, "User deleted successfully");
    } else {
      sendError(res, "User not found", undefined, 404);
    }
  } catch (error) {
    sendError(res, "Failed to delete user", (error as Error).message, 500);
  }
};
