import mongoose, { Document, Schema } from 'mongoose';

export interface Partner {
  name: string;
  qualification: string;
  membershipNo: string;
  designation: string;
  contact?: string;
}

export interface IFirm extends Document {
  firmName: string;
  registrationNumber: string;
  dateOfRegistration: Date;
  panGstNumber: string;
  firmType: "Partnership" | "LLP" | "Private Ltd" | "Others";
  firmTypeOther?: string;
  headOfficeAddress: string;
  cityStatePin: string;
  firmContactNumber: string;
  email: string;
  password: string;
  website?: string;
  partners: Partner[];
  areasOfPractice: string[];
  otherPracticeArea?: string;
  documents: string[];
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<Partner>({
  name: { type: String, required: true },
  qualification: { type: String, required: true },
  membershipNo: { type: String, required: true },
  designation: { type: String, required: true },
  contact: { type: String }
});

const FirmSchema = new Schema<IFirm>({
  firmName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  dateOfRegistration: { type: Date, required: true },
  panGstNumber: { type: String, required: true },
  firmType: { 
    type: String, 
    enum: ["Partnership", "LLP", "Private Ltd", "Others"],
    required: true 
  },
  firmTypeOther: { type: String },
  headOfficeAddress: { type: String, required: true },
  cityStatePin: { type: String, required: true },
  firmContactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  website: { type: String },
  partners: [PartnerSchema],
  areasOfPractice: [{ type: String }],
  otherPracticeArea: { type: String },
  documents: [{ type: String }],
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }
}, {
  timestamps: true
});

export default mongoose.model<IFirm>('Firm', FirmSchema);