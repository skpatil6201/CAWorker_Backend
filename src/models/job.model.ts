import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  firmId: mongoose.Types.ObjectId;
  firmName: string;
  status: "active" | "closed" | "draft";
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  salary: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { 
    type: String, 
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
    default: "Full-time"
  },
  firmId: { type: Schema.Types.ObjectId, ref: 'Firm', required: true },
  firmName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["active", "closed", "draft"],
    default: "active"
  },
  applicationsCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IJob>('Job', JobSchema);