import { Request, Response } from "express";
import UserModel from "../models/user.model";

export const getAllUsers = (req: Request, res: Response) => {
  const users = UserModel.getAll();
  res.json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = UserModel.getById(id);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const createUser = (req: Request, res: Response) => {
  const { name, address, phone, email, password, userType } = req.body;
  
  const newUser = UserModel.create({
    name,
    address,
    phone,
    email,
    password,
    userType
  });
  
  res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedUser = UserModel.update(id, req.body);
  
  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = UserModel.delete(id);
  
  if (deleted) {
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
