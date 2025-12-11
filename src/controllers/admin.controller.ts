import { Request, Response } from "express";
import AdminModel from "../models/admin.model";

export const getAllAdmins = (req: Request, res: Response) => {
  const admins = AdminModel.getAll();
  res.json(admins);
};

export const getAdminById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const admin = AdminModel.getById(id);
  
  if (admin) {
    res.json(admin);
  } else {
    res.status(404).json({ message: "Admin not found" });
  }
};

export const loginAdmin = (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  
  let admin;
  if (email) {
    admin = AdminModel.getByEmail(email);
  } else if (username) {
    admin = AdminModel.getByUsername(username);
  }
  
  if (admin && admin.password === password) {
    const { password: _, ...adminWithoutPassword } = admin;
    res.json({ message: "Login successful", admin: adminWithoutPassword });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const createAdmin = (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  
  const newAdmin = AdminModel.create({
    username,
    email,
    password,
    role: role || "Admin"
  });
  
  res.status(201).json(newAdmin);
};

export const updateAdmin = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedAdmin = AdminModel.update(id, req.body);
  
  if (updatedAdmin) {
    res.json(updatedAdmin);
  } else {
    res.status(404).json({ message: "Admin not found" });
  }
};

export const deleteAdmin = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = AdminModel.delete(id);
  
  if (deleted) {
    res.json({ message: "Admin deleted successfully" });
  } else {
    res.status(404).json({ message: "Admin not found" });
  }
};