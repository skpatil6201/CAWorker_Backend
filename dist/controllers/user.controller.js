"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const getAllUsers = async (req, res) => {
    try {
        const users = await user_model_1.default.find().select('-password');
        (0, response_1.sendSuccess)(res, "Users retrieved successfully", users);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve users", error.message, 500);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await user_model_1.default.findById(id).select('-password');
        if (user) {
            (0, response_1.sendSuccess)(res, "User retrieved successfully", user);
        }
        else {
            (0, response_1.sendError)(res, "User not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to retrieve user", error.message, 500);
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const { name, address, phone, email, password, userType } = req.body;
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return (0, response_1.sendError)(res, "User already exists with this email", undefined, 409);
        }
        // Hash password
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newUser = new user_model_1.default({
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
        (0, response_1.sendSuccess)(res, "User created successfully", userResponse, 201);
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to create user", error.message, 500);
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        // If password is being updated, hash it
        if (req.body.password) {
            req.body.password = await (0, auth_1.hashPassword)(req.body.password);
        }
        const updatedUser = await user_model_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-password');
        if (updatedUser) {
            (0, response_1.sendSuccess)(res, "User updated successfully", updatedUser);
        }
        else {
            (0, response_1.sendError)(res, "User not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to update user", error.message, 500);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await user_model_1.default.findByIdAndDelete(id);
        if (deletedUser) {
            (0, response_1.sendSuccess)(res, "User deleted successfully");
        }
        else {
            (0, response_1.sendError)(res, "User not found", undefined, 404);
        }
    }
    catch (error) {
        (0, response_1.sendError)(res, "Failed to delete user", error.message, 500);
    }
};
exports.deleteUser = deleteUser;
