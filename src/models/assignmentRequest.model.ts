import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignmentRequest extends Document {
  firmId: mongoose.Types.ObjectId;
  firmName: string;
  firmRegistrationNumber: string;
  contactPersonName: string;
  mobileNumber: string;
  email: string;
  officeAddress: string;
  cityStatePin: string;
  assignmentType: string;
  assignmentTypeOther?: string;
  industryNatureOfBusiness: string;
  assignmentLocation: string;
  expectedStartDate: string;
  expectedDuration: string;
  workingHours: string;
  auditorsRequired: number;
  experienceRequired: string;
  skillsRequired: string[];
  paymentToAuditor: string;
  accommodationTravelProvided: boolean;
  agreedToServiceCharges: boolean;
  declaration: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentRequestSchema = new Schema<IAssignmentRequest>({
  firmId: { type: Schema.Types.ObjectId, ref: 'Firm', required: true },
  firmName: { type: String, required: true },
  firmRegistrationNumber: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  officeAddress: { type: String, required: true },
  cityStatePin: { type: String, required: true },
  assignmentType: { type: String, required: true },
  assignmentTypeOther: { type: String },
  industryNatureOfBusiness: { type: String, required: true },
  assignmentLocation: { type: String, required: true },
  expectedStartDate: { type: String, required: true },
  expectedDuration: { type: String, required: true },
  workingHours: { type: String, required: true },
  auditorsRequired: { type: Number, required: true },
  experienceRequired: { type: String, required: true },
  skillsRequired: { type: [String], default: [] },
  paymentToAuditor: { type: String, required: true },
  accommodationTravelProvided: { type: Boolean, required: true },
  agreedToServiceCharges: { type: Boolean, required: true },
  declaration: { type: Boolean, required: true },
  status: { type: String, default: 'pending' },
}, {
  timestamps: true,
});

export default mongoose.model<IAssignmentRequest>('AssignmentRequest', AssignmentRequestSchema);
