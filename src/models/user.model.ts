import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  userType: "Worker" | "CA";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ["Worker", "CA"],
    required: true 
  }
}, {
  timestamps: true
});

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ userType: 1 });

export default mongoose.model<IUser>('User', UserSchema);