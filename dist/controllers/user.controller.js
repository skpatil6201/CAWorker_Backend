"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getAllUsers = (req, res) => {
    const users = user_model_1.default.getAll();
    res.json(users);
};
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    const user = user_model_1.default.getById(id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({ message: "User not found" });
    }
};
exports.getUserById = getUserById;
const createUser = (req, res) => {
    const { name, address, phone, email, password, userType } = req.body;
    const newUser = user_model_1.default.create({
        name,
        address,
        phone,
        email,
        password,
        userType
    });
    res.status(201).json(newUser);
};
exports.createUser = createUser;
const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedUser = user_model_1.default.update(id, req.body);
    if (updatedUser) {
        res.json(updatedUser);
    }
    else {
        res.status(404).json({ message: "User not found" });
    }
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = user_model_1.default.delete(id);
    if (deleted) {
        res.json({ message: "User deleted successfully" });
    }
    else {
        res.status(404).json({ message: "User not found" });
    }
};
exports.deleteUser = deleteUser;
