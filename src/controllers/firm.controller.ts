import { Request, Response } from "express";
import FirmModel from "../models/firm.model";

export const getAllFirms = (req: Request, res: Response) => {
  const firms = FirmModel.getAll();
  res.json(firms);
};

export const getFirmById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const firm = FirmModel.getById(id);
  
  if (firm) {
    res.json(firm);
  } else {
    res.status(404).json({ message: "Firm not found" });
  }
};

export const registerFirm = (req: Request, res: Response) => {
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
    password,
    website,
    partners: partners || [],
    areasOfPractice: areasOfPractice || [],
    otherPracticeArea,
    documents: documents || []
  });
  
  res.status(201).json(newFirm);
};

export const loginFirm = (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const firm = FirmModel.getByEmail(email);
  if (firm && firm.password === password) {
    const { password: _, ...firmWithoutPassword } = firm;
    res.json({ message: "Login successful", firm: firmWithoutPassword });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const updateFirm = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedFirm = FirmModel.update(id, req.body);
  
  if (updatedFirm) {
    res.json(updatedFirm);
  } else {
    res.status(404).json({ message: "Firm not found" });
  }
};

export const deleteFirm = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = FirmModel.delete(id);
  
  if (deleted) {
    res.json({ message: "Firm deleted successfully" });
  } else {
    res.status(404).json({ message: "Firm not found" });
  }
};