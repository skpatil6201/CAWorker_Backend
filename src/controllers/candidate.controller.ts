import { Request, Response } from "express";
import CandidateModel from "../models/candidate.model";

export const getAllCandidates = (req: Request, res: Response) => {
  const candidates = CandidateModel.getAll();
  res.json(candidates);
};

export const getCandidateById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const candidate = CandidateModel.getById(id);
  
  if (candidate) {
    res.json(candidate);
  } else {
    res.status(404).json({ message: "Candidate not found" });
  }
};

export const registerCandidate = (req: Request, res: Response) => {
  const {
    fullName,
    dateOfBirth,
    gender,
    mobileNumber,
    email,
    password,
    address,
    highestQualification,
    certifications,
    yearsOfExperience,
    currentPreviousEmployer,
    positionHeld,
    areasOfExpertise,
    softwareProficiency,
    otherSoftware,
    documents
  } = req.body;
  
  const newCandidate = CandidateModel.create({
    fullName,
    dateOfBirth,
    gender,
    mobileNumber,
    email,
    password,
    address,
    highestQualification,
    certifications,
    yearsOfExperience,
    currentPreviousEmployer,
    positionHeld,
    areasOfExpertise: areasOfExpertise || [],
    softwareProficiency: softwareProficiency || [],
    otherSoftware,
    documents: documents || []
  });
  
  res.status(201).json(newCandidate);
};

export const loginCandidate = (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const candidate = CandidateModel.getByEmail(email);
  if (candidate && candidate.password === password) {
    const { password: _, ...candidateWithoutPassword } = candidate;
    res.json({ message: "Login successful", candidate: candidateWithoutPassword });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const updateCandidate = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedCandidate = CandidateModel.update(id, req.body);
  
  if (updatedCandidate) {
    res.json(updatedCandidate);
  } else {
    res.status(404).json({ message: "Candidate not found" });
  }
};

export const deleteCandidate = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = CandidateModel.delete(id);
  
  if (deleted) {
    res.json({ message: "Candidate deleted successfully" });
  } else {
    res.status(404).json({ message: "Candidate not found" });
  }
};