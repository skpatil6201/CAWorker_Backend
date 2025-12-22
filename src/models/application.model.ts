import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  jobTitle: string;
  candidateId: mongoose.Types.ObjectId;
  candidateName: string;
  candidateEmail: string;
  firmId: mongoose.Types.ObjectId;
  firmName: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  appliedAt: Date;
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: { type: String, required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  firmId: { type: Schema.Types.ObjectId, ref: 'Firm', required: true },
  firmName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "reviewed", "shortlisted", "rejected", "hired"],
    default: "pending"
  },
  appliedAt: { type: Date, default: Date.now },
  coverLetter: { type: String },
  resumeUrl: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);