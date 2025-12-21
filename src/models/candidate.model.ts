import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  fullName: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  mobileNumber: string;
  email: string;
  password: string;
  address: string;
  highestQualification: string;
  certifications?: string;
  yearsOfExperience: "0-1" | "1-3" | "3-5" | "5+";
  currentPreviousEmployer?: string;
  positionHeld?: string;
  areasOfExpertise: string[];
  softwareProficiency: string[];
  otherSoftware?: string;
  documents: string[];
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other"],
    required: true 
  },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  highestQualification: { type: String, required: true },
  certifications: { type: String },
  yearsOfExperience: { 
    type: String, 
    enum: ["0-1", "1-3", "3-5", "5+"],
    required: true 
  },
  currentPreviousEmployer: { type: String },
  positionHeld: { type: String },
  areasOfExpertise: [{ type: String }],
  softwareProficiency: [{ type: String }],
  otherSoftware: { type: String },
  documents: [{ type: String }],
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }
}, {
  timestamps: true
});

// Create indexes
CandidateSchema.index({ email: 1 });
CandidateSchema.index({ mobileNumber: 1 });
CandidateSchema.index({ status: 1 });
CandidateSchema.index({ yearsOfExperience: 1 });

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);