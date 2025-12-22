import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  role: "SuperAdmin" | "Admin";
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["SuperAdmin", "Admin"],
    default: "Admin"
  }
}, {
  timestamps: true
});

export default mongoose.model<IAdmin>('Admin', AdminSchema);